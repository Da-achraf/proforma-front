import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  QueryList,
  signal,
  untracked,
  ViewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { HasEventTargetAddRemove } from 'rxjs/internal/observable/fromEvent';
import { DeliveryAddress } from '../../models/delivery-address.model';
import {
  ItemModel,
  userRoleToMandatoryForMapper,
} from '../../models/request-item.model';
import {
  CreateRequest,
  CURRENCY_CODES,
  INCOTERMES,
  INVOICE_TYPES,
  ModesOfTransports,
  SHIPPED_VIA_OPTIONS,
} from '../../models/request.model';
import { Ship } from '../../models/ship.model';
import { AuthService } from '../../services/auth.service';
import { DeliveryAddressService } from '../../services/delivery-address.service';
import { RequestService } from '../../services/request.service';
import { ScenarioService } from '../../services/scenario.service';
import { ShippointService } from '../../services/shippoint.service';
import { UserStoreService } from '../../services/user-store.service';
import { ToasterService } from '../../shared/services/toaster.service';
import { DeliveryAddressCrudComponent } from '../delivery-address/delivery-address-crud/delivery-address-crud.component';
import { HistoricalData } from '../../models/historical-data.model';
import { HistoricalDataService } from '../../feature/historical-data/hitorical-data.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Overlay } from 'primeng/overlay';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';

@Component({
  selector: 'app-create-request-dialog',
  templateUrl: './create-request-dialog.component.html',
  styleUrls: ['./create-request-dialog.component.css'],
  providers: [ToasterService],
})
export class CreateRequestDialogComponent implements OnInit, OnDestroy {
  // Injected dependencies
  dialog = inject(MatDialog);
  toaster = inject(ToasterService);
  historicalDataService = inject(HistoricalDataService);

  requestForm!: FormGroup;
  shipPoints: Ship[] = [];
  deliveryAddresses: DeliveryAddress[] = [];
  currencyCodes = signal<string[]>(CURRENCY_CODES);
  invoiceTypes = signal<string[]>(INVOICE_TYPES);
  incotermOptions = signal<string[]>(INCOTERMES);
  shippedViaOptions = signal<string[]>(SHIPPED_VIA_OPTIONS);
  modesOfTransports: string[] = ModesOfTransports;
  userRole = inject(UserStoreService).userRole;

  isLoadingMaterial = false;
  private readonly destroy$ = new Subject<void>();

  filteredOptions!: Observable<string[]>;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.currencyCodes().filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  // Signals
  scenarios = toSignal(this.scenarioService.getScenarios(), {
    initialValue: [],
  });
  selectedScenarioId = signal(0);
  selectedScenario = computed(() =>
    this.scenarios().find((s) => s.id_scenario === this.selectedScenarioId())
  );

  formItems = computed(() => {
    const selectedScenarioItems: ItemModel[] =
      this.selectedScenario()?.items ?? [];

    const userRole = this.userRole();

    if (!selectedScenarioItems.length || !userRole) return [];

    const mandatoryForUser = userRoleToMandatoryForMapper(userRole);

    return selectedScenarioItems.map((item) => {
      return {
        ...item,
        isMandatory:
          item && mandatoryForUser
            ? item.mandatoryFor?.includes(mandatoryForUser) ?? false
            : false,
      };
    });
  });

  selectedScenarioEffect = effect(() => {
    const selectedScenario = this.selectedScenario();
    if (!selectedScenario) return;

    untracked(() => {
      this.items.clear();
      this.addItem();
    });
  });

  constructor(
    private fb: FormBuilder,
    private scenarioService: ScenarioService,
    private shippointService: ShippointService,
    private deliveryAddressService: DeliveryAddressService,
    private requestService: RequestService,
    private authService: AuthService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<CreateRequestDialogComponent>
  ) {}

  onChange(text: string) {
    this.filteredOptions = of(text).pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      invoicesTypes: ['', Validators.required],
      scenarioId: ['', Validators.required],
      shippingPoint: ['', Validators.required],
      deliveryAddress: ['', Validators.required],
      incoterm: ['', Validators.required],
      dhlAccount: [''],
      modeOfTransport: ['', Validators.required],
      shippedVia: ['', Validators.required],
      costCenter: ['', Validators.required],
      currency: ['', Validators.required],
      items: this.fb.array([]),
    });
    this.loadShipPoints();
    this.loadDeliveryAddresses();
    this.onScenarioChange();
    this.onShippingOrDeliveryChange();

    this.fetchOptions();
  }

  // Historical data labo
  @ViewChildren(MatAutocompleteTrigger)
  autocompleteTriggers!: QueryList<MatAutocompleteTrigger>;

  private materialInputSubject = new Subject<{
    value: string;
    index: number;
  }>();

  onMaterialChange(value: string, index: number) {
    this.materialInputSubject.next({ value, index });
  }

  selectMaterial(data: HistoricalData, formIndex: number) {
    const itemForm = this.getFormAtIndex(formIndex);
    if (!itemForm) return;

    // Update form controls
    const updateControl = (controlName: string, value: any) => {
      const control = itemForm.get(controlName)?.get('value');
      if (control) control.setValue(value);
    };

    updateControl('Material', data.material);
    updateControl('Unit Value', data.unitValue);
    updateControl('Unit', data.unit);
    updateControl('Description', data.description);
    updateControl('HtsCode', data.htsCode);
    updateControl('Coo', data.coo);

    // Clear autocomplete
    this.materialOptions.set([]);
  }

  private getFormAtIndex(index: number) {
    // This is just a placeholder - update with your actual form access method
    return this.items.at(index);
  }

  materialOptions = signal<Record<number, HistoricalData[]>>({});

  fetchOptions() {
    this.materialInputSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged((prev, curr) => prev.value === curr.value),
        filter(({ value }) => value.length != 0),
        switchMap(({ value, index }) => {
          const searchTerm = (value || '').trim();
          if (searchTerm.length < 2) {
            this.materialOptions.update((options) => {
              options[index] = [];
              return options;
            });
            return of({ result: [], index });
          }

          this.isLoadingMaterial = true;

          return this.historicalDataService
            .getHistoricalDataByMaterial(searchTerm)
            .pipe(
              map((result) => ({ result, index })),
              catchError((err) => {
                console.error('Error fetching material data', err);
                this.toaster.showError('Failed to load material data');
                return of({ result: [], index });
              })
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(({ result, index }) => {
        this.isLoadingMaterial = false;

        // Update options for specific index
        this.materialOptions.update((options) => ({
          ...options,
          [index]: result || [],
        }));

        if (result?.length === 0) {
          this.toaster.showWarning('No matching materials found');
        }

        // Open panel for specific index
        setTimeout(() => {
          const trigger = this.autocompleteTriggers.get(index);
          trigger?.openPanel();
        });
      });
  }
  // Historical data labo ends here

  createItem(data?: any): FormGroup {
    const formItems = this.formItems();
    if (!formItems) return this.fb.group({});
    const group: { [key: string]: FormGroup } = {};

    formItems.forEach((item: ItemModel) => {
      const fieldData =
        this.findDataOfItem(item.nameItem, data?.values) ?? undefined;
      group[item.nameItem] = this.fb.group({
        name: item.nameItem,
        value: [
          '',
          fieldData?.isMandatory || item.isMandatory
            ? Validators.required
            : null,
        ],
        type: [fieldData ? fieldData?.type : item.type],
      });
    });
    return this.fb.group(group);
  }

  findDataOfItem(itemName: string, data: any[]) {
    let foundData: any = null;
    data?.forEach((d) => {
      if (d['name'] === itemName) foundData = d;
    });

    return foundData;
  }

  addItem() {
    this.items.push(this.createItem());
    this.materialOptions.update((options) => ({
      ...options,
      [this.items.length - 1]: [],
    }));
  }

  removeItem(index: number) {
    if (this.items.length <= 1) return;
    this.items.removeAt(index);
    this.materialOptions.update((options) => {
      delete options[index];
      return { ...options };
    });
  }

  emptyItem(index: number) {
    const item = this.items.at(index) as FormGroup;

    // Get all control names in the form group
    Object.keys(item.controls).forEach((controlName) => {
      // For each nested form group (like "Material", "Quantity", etc.)
      const nestedGroup = item.get(controlName) as FormGroup;

      if (nestedGroup && nestedGroup.contains('value')) {
        nestedGroup.get('value')?.setValue('');
      }
    });
  }

  get items(): FormArray {
    return this.requestForm.get('items') as FormArray;
  }

  fieldsArray(index: number): FormArray {
    return this.items.at(index).get('fields') as FormArray;
  }

  loadShipPoints(): void {
    this.shippointService.getShipPoints().subscribe(
      (shippingPoints) => {
        this.shipPoints = shippingPoints;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading shipping points',
        });
        console.error('Error loading shipping points:', error);
      }
    );
  }

  loadDeliveryAddresses(): void {
    this.deliveryAddressService.getDeliveryAddresses().subscribe(
      (addresses) => {
        this.deliveryAddresses = addresses;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading delivery addresses',
        });
        console.error('Error loading delivery addresses:', error);
      }
    );
  }

  onScenarioChange(): void {
    const scenarioIdControl = this.requestForm.get('scenarioId');
    this.selectedScenarioId.set(scenarioIdControl?.value ?? 0);
    // this.scenearioIdSubject.next(scenarioIdControl?.value ?? 0);
  }

  setFormValidators(attributes: any[]): void {
    attributes.forEach((attr) => {
      const control = this.requestForm.get(attr.attributeName.toLowerCase());
      if (control) {
        if (attr.isMandatory) {
          control.setValidators(Validators.required);
        } else {
          control.clearValidators();
        }
        control.updateValueAndValidity();
      }
      // Handling item form group validators
      this.items.controls.forEach((itemGroup) => {
        const itemControl = itemGroup.get(attr.attributeName.toLowerCase());
        if (itemControl) {
          if (attr.isMandatory) {
            itemControl.setValidators(Validators.required);
          } else {
            itemControl.clearValidators();
          }
          itemControl.updateValueAndValidity();
        }
      });
    });
  }

  onSubmit(): void {
    console.log('request form: ', this.requestForm.value);
    if (this.requestForm) {
      const userId = this.authService.getUserIdFromToken();
      const scenarioId = this.requestForm.value.scenarioId;
      if (typeof scenarioId === 'number') {
        const shippingPointId =
          this.shipPoints.find(
            (point) => point.id_ship === this.requestForm.value.shippingPoint
          )?.id_ship ?? 0;
        const deliveryAddressId =
          this.deliveryAddresses.find(
            (address) => address.id === this.requestForm.value.deliveryAddress
          )?.id ?? 0;
        const requestData: CreateRequest = {
          invoicesTypes: this.requestForm.value.invoicesTypes,
          shipPointId: shippingPointId,
          deliveryAddressId: deliveryAddressId,
          incoterm: this.requestForm.value.incoterm,
          costCenter: this.requestForm.value.costCenter,
          userId: userId,
          scenarioId: scenarioId,
          shippedvia: this.requestForm.value.shippedVia,
          currency: this.requestForm.value.currency,
          modeOfTransport: this.requestForm.value.modeOfTransport,
          dimension: this.requestForm.value.dimension,
          itemsWithValuesJson: JSON.stringify(this.requestForm.value.items),
        };
        this.requestService.createRequest(requestData).subscribe(
          (response) => {
            this.dialogRef.close(response);
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error creating request',
            });
            console.error('Error creating request:', error);
          }
        );
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Scenario ID is not a number',
        });
        console.error('Scenario ID is not a number');
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Form is invalid',
      });
      console.error('Form is invalid');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onShippingOrDeliveryChange(): void {
    this.requestForm
      .get('shippingPoint')
      ?.valueChanges.subscribe(() => this.checkShippingAndDelivery());
    this.requestForm
      .get('deliveryAddress')
      ?.valueChanges.subscribe(() => this.checkShippingAndDelivery());
  }

  checkShippingAndDelivery(): void {
    const shippingPoint = this.requestForm.get('shippingPoint')?.value;
    const deliveryAddress = this.requestForm.get('deliveryAddress')?.value;

    if (shippingPoint && deliveryAddress) {
      this.updateIncoterm(shippingPoint, deliveryAddress);
    }
  }

  private updateIncoterm(
    shippingPointId: number,
    deliveryAddressId: number
  ): void {
    const shippingPoint = this.shipPoints.find(
      (point) => point.id_ship === shippingPointId
    );
    const deliveryAddress = this.deliveryAddresses.find(
      (address) => address.id === deliveryAddressId
    );

    if (shippingPoint?.isTe && deliveryAddress?.isTe) {
      this.requestForm.patchValue({ incoterm: 'FCA' });
    } else {
      this.requestForm.patchValue({ incoterm: '' });
    }
  }

  onDeliveryAddressChange(option: string) {
    if (option != 'other') return;

    this.dialog
      .open(DeliveryAddressCrudComponent)
      .afterClosed()
      .subscribe((result) => {
        const addressControl = this.requestForm.get('deliveryAddress');
        if (result) {
          this.loadDeliveryAddresses();
          addressControl?.patchValue(result);
        } else {
          addressControl?.patchValue(null);
        }
      });
  }

  ngOnDestroy(): void {
    this.materialInputSubject.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
