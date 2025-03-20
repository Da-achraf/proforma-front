import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import _ from 'lodash';
import { MessageService } from 'primeng/api';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { DeliveryAddressService } from '../../core/delivery-address/delivery-address.service';
import { HistoricalData } from '../../core/models/historical-data.model';
import {
  ItemModel,
  userRoleToMandatoryForMapper,
} from '../../core/models/request-item.model';
import {
  CURRENCY_CODES,
  INCOTERMES,
  INVOICE_TYPES,
  ModesOfTransports,
  RequestModel,
  SHIPPED_VIA_OPTIONS,
  UpdateRequestByRequester,
} from '../../core/models/request.model';
import { Ship } from '../../core/models/ship.model';
import { DeliveryAddressCrudComponent } from '../../feature/delivery-address/delivery-address-crud/delivery-address-crud.component';
import { HistoricalDataService } from '../../feature/historical-data/hitorical-data.service';
import { RequestService } from '../../services/request.service';
import { ScenarioService } from '../../services/scenario.service';
import { ShippointService } from '../../services/shippoint.service';
import { UserStoreService } from '../../services/user-store.service';
import { LoadingDotsComponent } from '../../shared/components/loading-dots/loading-dots.component';
import { RequestStatusComponent } from '../../shared/components/request-status/request-status.component';
import { mergeArrays } from '../../shared/components/tables/helpers';
import { ToasterService } from '../../shared/services/toaster.service';
import {
  enhanceItemsWithCacheData,
  enhancementConfig,
} from '../../shared/utils/historical-data.util';
import { CreateRequestDialogComponent } from '../create-request-dialog/create-request-dialog.component';

@Component({
  selector: 'app-edit-request-requester',
  templateUrl: './edit-request-requester.component.html',
  styleUrl: './edit-request-requester.component.css',
  imports: [
    RequestStatusComponent,
    ReactiveFormsModule,
    MatIcon,
    MatFormFieldModule,
    MatInput,
    MatTooltip,
    MatSelectModule,
    MatAutocompleteModule,
    MatProgressSpinner,
    LoadingDotsComponent,
    MatDialogModule,
    MatButtonModule,
  ],
})
export class EditRequestRequesterComponent implements OnInit, OnDestroy {
  // Injected dependencies
  dialog = inject(MatDialog);
  toaster = inject(ToasterService);
  historicalDataService = inject(HistoricalDataService);
  deliveryAddressService = inject(DeliveryAddressService);

  requestForm!: FormGroup;

  private destroy$ = new Subject<void>();

  shipPoints: Ship[] = [];
  deliveryAddresses = this.deliveryAddressService.allAddresses;

  currencyCodes = signal<string[]>(CURRENCY_CODES);
  invoiceTypes = signal<string[]>(INVOICE_TYPES);
  incotermOptions = signal<string[]>(INCOTERMES);
  shippedViaOptions = signal<string[]>(SHIPPED_VIA_OPTIONS);
  modesOfTransports: string[] = ModesOfTransports;
  userRole = inject(UserStoreService).userRole;

  data: { requestNumber: number } = inject(MAT_DIALOG_DATA);
  request$ = this.requestService.getRequestById(this.data.requestNumber).pipe(
    shareReplay(1),
    catchError((err) => {
      this.onNoClick();
      throw err;
    }),
  );
  requestSig = toSignal(this.request$);

  // Signals and computed values
  scenarios = toSignal(this.scenarioService.getScenarios());
  selectedScenarioId = signal(0);
  selectedScenarioChanged = signal<number | undefined>(undefined);

  patchedScenario = computed(() => this.requestSig()?.scenario);

  selectedScenario = computed(() =>
    this.scenarios()?.find((s) => s.id_scenario === this.selectedScenarioId()),
  );

  formItems = computed(() => {
    const patchedScenario = this.patchedScenario();
    const selectedScenario = this.selectedScenario();

    const scenarioItems: ItemModel[] = selectedScenario
      ? selectedScenario.items
      : patchedScenario
        ? patchedScenario.items
        : [];

    const userRole = this.userRole();

    if (!scenarioItems.length || !userRole) return [];

    const mandatoryForUser = userRoleToMandatoryForMapper(userRole);

    return scenarioItems.map((item) => {
      return {
        ...item,
        isMandatory:
          item && mandatoryForUser
            ? (item.mandatoryFor?.includes(mandatoryForUser) ?? false)
            : false,
      };
    });
  });

  existingItemsData = computed(() => {
    const request = this.requestSig();
    if (!request || !request.scenario) return;
    return request.itemsWithValues;
  });

  constructor(
    private fb: FormBuilder,
    private scenarioService: ScenarioService,
    private shippointService: ShippointService,
    private requestService: RequestService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<CreateRequestDialogComponent>,
  ) {
    effect(() => {
      const changed = this.selectedScenarioChanged();

      if (changed) {
        this.items?.clear();
        this.addItem();
      }
    });

    effect(() => {
      const formItems = this.formItems();
      const existingItemsData = this.existingItemsData();

      if (existingItemsData?.length == 0) return;
      this.items?.clear();
      if (existingItemsData && existingItemsData.length > 0) {
        this.patchExistingData(existingItemsData);
      } else {
        this.addItem();
      }
    });
  }

  @ViewChildren(MatAutocompleteTrigger)
  autocompleteTriggers!: QueryList<MatAutocompleteTrigger>;

  filteredHistoricalDataOptions = signal<Record<number, HistoricalData[]>>({});
  filteredHistoricalDataOptionsCache = signal<Record<number, HistoricalData>>(
    {},
  );
  private materialInputSubject = new Subject<{
    value: string;
    index: number;
  }>();
  isLoadingMaterial: boolean = false;

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
    this.deliveryAddressService.triggerLoadAllAddresses();
    this.onScenarioChange();
    this.onShippingOrDeliveryChange();

    this.request$.subscribe({
      next: (request: RequestModel) => {
        this.requestForm.patchValue({
          invoicesTypes: request?.invoicesTypes,
          scenarioId: request?.scenario?.id_scenario,
          shippingPoint: request?.shipPoint.id_ship,
          deliveryAddress: request?.deliveryAddress?.id,
          incoterm: request?.incoterm,
          dhlAccount: request?.dhlAccount,
          modeOfTransport: request?.modeOfTransport,
          shippedVia: request?.shippedVia,
          costCenter: request?.costCenter,
          currency: request.currency,
        });
      },
    });

    this.fetchOptions();
  }

  patchExistingData(data: any[]) {
    this.items.clear();
    data?.forEach((itemData) => {
      this.items.push(this.createItem(itemData));
    });
  }

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
          fieldData ? fieldData?.value : '',
          fieldData?.isMandatory || item.isMandatory
            ? Validators.required
            : null,
        ],
        type: [fieldData ? fieldData?.type : item.type],
        isMandatory: [fieldData?.isMandatory],
      });
    });
    return this.fb.group(group);
  }

  findDataOfItem(itemName: string, data: any[]) {
    console.log('data: ', data);
    let foundData: any = null;
    data?.forEach((d) => {
      if (d['name'] === itemName) foundData = d;
    });

    return foundData;
  }

  addItem() {
    console.log('addItem called...');
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    if (this.items.length <= 1) return;
    this.items.removeAt(index);
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
      },
    );
  }

  onScenarioChange(): void {
    const scenarioIdControl = this.requestForm.get('scenarioId');
    this.selectedScenarioId.set(scenarioIdControl?.value ?? 0);
    this.selectedScenarioChanged.set(scenarioIdControl?.value ?? undefined);
  }

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

    // Clear autocomplete and save selected historical data to a local cache
    this.filteredHistoricalDataOptionsCache.update((options) => ({
      ...options,
      [formIndex]: data,
    }));
    this.filteredHistoricalDataOptions.set({});
  }

  private getFormAtIndex(index: number) {
    // This is just a placeholder - update with your actual form access method
    return this.items.at(index);
  }

  fetchOptions() {
    this.materialInputSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged((prev, curr) => prev.value === curr.value),
        filter(({ value }) => value.length != 0),
        switchMap(({ value, index }) => {
          const searchTerm = (value || '').trim();
          if (searchTerm.length < 2) {
            this.filteredHistoricalDataOptions.update((options) => {
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
                this.toaster.showError('Failed to load material data');
                return of({ result: [], index });
              }),
            );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(({ result, index }) => {
        this.isLoadingMaterial = false;

        // Update options for specific index
        this.filteredHistoricalDataOptions.update((options) => ({
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
    if (this.requestForm) {
      const scenarioId = this.requestForm.value.scenarioId;
      if (typeof scenarioId === 'number') {
        const shippingPointId =
          this.shipPoints.find(
            (point) => point.id_ship === this.requestForm.value.shippingPoint,
          )?.id_ship ?? 0;
        const deliveryAddressId =
          this.deliveryAddresses().find(
            (address) => address.id === this.requestForm.value.deliveryAddress,
          )?.id ?? 0;

        const existingItemsData = this.existingItemsData() ?? [];
        const enhancedItems = enhanceItemsWithCacheData(
          _.cloneDeep(this.requestForm.value.items),
          this.filteredHistoricalDataOptionsCache(),
          enhancementConfig,
        );

        const requestData: UpdateRequestByRequester = {
          invoicesTypes: this.requestForm.value.invoicesTypes,
          shipPointId: shippingPointId,
          deliveryAddressId: deliveryAddressId,
          incoterm: this.requestForm.value.incoterm,
          costCenter: this.requestForm.value.costCenter,
          scenarioId: scenarioId,
          shippedvia: this.requestForm.value.shippedVia,
          currency: this.requestForm.value.currency,
          modeOfTransport: this.requestForm.value.modeOfTransport,
          itemsWithValuesJson: JSON.stringify(
            mergeArrays(existingItemsData, enhancedItems),
          ),
        };

        this.requestService
          .updateRequestByRequester(this.data.requestNumber, requestData)
          .subscribe({
            next: () => {
              this.toaster.showSuccess('Request updated successfully');
              this.dialogRef.close(true);
            },
            error: () => this.toaster.showError('Error editing the request'),
          });
      } else {
        this.toaster.showWarning('Scenario ID is not a number');
      }
    } else {
      this.toaster.showWarning('Form is invalid');
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

  updateIncoterm(shippingPointId: number, deliveryAddressId: number): void {
    const shippingPoint = this.shipPoints.find(
      (point) => point.id_ship === shippingPointId,
    );
    const deliveryAddress = this.deliveryAddresses().find(
      (address) => address.id === deliveryAddressId,
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
      .open(DeliveryAddressCrudComponent, {
        data: {
          makeFieldsMandatory: true,
        },
      })
      .afterClosed()
      .pipe(
        map((result) => result?.data),
        switchMap((body) => this.deliveryAddressService.save(body)),
      )
      .subscribe((address) => {
        const addressControl = this.requestForm.get('deliveryAddress');
        if (address) {
          this.deliveryAddressService.triggerLoadAllAddresses();
          addressControl?.patchValue(address.id);
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
