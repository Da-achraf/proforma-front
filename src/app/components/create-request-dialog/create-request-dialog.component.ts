import {
  Component,
  computed,
  effect,
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
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import _ from 'lodash';
import { MessageService } from 'primeng/api';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
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
  CreateRequest,
  CURRENCY_CODES,
  INCOTERMES,
  INVOICE_TYPES,
  ModesOfTransports,
  SHIPPED_VIA_OPTIONS,
} from '../../core/models/request.model';
import { Ship } from '../../core/models/ship.model';
import { DeliveryAddressCrudComponent } from '../../feature/delivery-address/delivery-address-crud/delivery-address-crud.component';
import { HistoricalDataService } from '../../feature/historical-data/hitorical-data.service';
import { ToastComponent } from '../../pattern/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { ScenarioService } from '../../services/scenario.service';
import { ShippointService } from '../../services/shippoint.service';
import { UserStoreService } from '../../services/user-store.service';
import { ToasterService } from '../../shared/services/toaster.service';
import {
  enhanceItemsWithCacheData,
  enhancementConfig,
} from '../../shared/utils/historical-data.util';

@Component({
  selector: 'app-create-request-dialog',
  templateUrl: './create-request-dialog.component.html',
  styleUrls: ['./create-request-dialog.component.css'],
  providers: [ToasterService],
  imports: [
    ToastComponent,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInput,
    MatSelectModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDivider,
    MatDialogModule,
  ],
})
export class CreateRequestDialogComponent implements OnInit, OnDestroy {
  // Injected dependencies
  dialog = inject(MatDialog);
  toaster = inject(ToasterService);
  historicalDataService = inject(HistoricalDataService);
  deliveryAddressService = inject(DeliveryAddressService);

  requestForm!: FormGroup;
  shipPoints: Ship[] = [];
  deliveryAddresses = this.deliveryAddressService.allAddresses;
  currencyCodes = signal<string[]>(CURRENCY_CODES);
  invoiceTypes = signal<string[]>(INVOICE_TYPES);
  incotermOptions = signal<string[]>(INCOTERMES);
  shippedViaOptions = signal<string[]>(SHIPPED_VIA_OPTIONS);
  modesOfTransports: string[] = ModesOfTransports;
  userRole = inject(UserStoreService).userRole;

  private destroy$ = new Subject<void>();

  isLoadingMaterial = false;

  // Signals
  scenarios = toSignal(this.scenarioService.getScenarios(), {
    initialValue: [],
  });
  selectedScenarioId = signal(0);
  selectedScenario = computed(() =>
    this.scenarios().find((s) => s.id_scenario === this.selectedScenarioId()),
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
            ? (item.mandatoryFor?.includes(mandatoryForUser) ?? false)
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
    private requestService: RequestService,
    private authService: AuthService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<CreateRequestDialogComponent>,
  ) {}

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

    this.fetchOptions();
  }

  // Historical data labo
  @ViewChildren(MatAutocompleteTrigger)
  autocompleteTriggers!: QueryList<MatAutocompleteTrigger>;

  private materialInputSubject = new Subject<{
    value: string;
    index: number;
  }>();

  /**
   * Signal tracking filtered historical data options for each request item in the form array.
   * Maps item indices to historical data arrays that match user input during material field interactions.
   *
   * - Updated when a user starts typing in a material field (search phase)
   * - Cleared/reset when the user finalizes their material selection
   *
   * @structure
   * Key: Index position in the request items form array
   * Value: Array of historical records matching the partial material input
   */
  filteredHistoricalDataOptions = signal<Record<number, HistoricalData[]>>({});

  /**
   * Signal acting as a cache for historical data selections made per request item.
   * Stores complete historical records to automatically augment items with additional
   * compliance fields required for approval workflows.
   *
   * Used to enrich request items with non-user-provided data from historical records:
   * - Adds fields like HTS Code and COO that requesters don't input
   * - Provides critical trade compliance data for subsequent approval stages
   *
   * @example
   * // When material "11233-456" is selected for item index 1:
   * {
   *   1: {
   *     id: 3,
   *     material: "11233-456",
   *     unitValue: 12.31,
   *     unit: "Wagon",
   *     description: "DESC Wagon",
   *     htsCode: "1231230",  // Auto-added to request item
   *     coo: "MA"            // Auto-added to request item
   *   }
   * }
   */
  filteredHistoricalDataOptionsCache = signal<Record<number, HistoricalData>>(
    {},
  );

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
              catchError(() => {
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
    this.filteredHistoricalDataOptions.update((options) => ({
      ...options,
      [this.items.length - 1]: [],
    }));
  }

  removeItem(index: number) {
    if (this.items.length <= 1) return;
    this.items.removeAt(index);
    this.filteredHistoricalDataOptions.update((options) => {
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
      },
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
    if (this.requestForm) {
      const userId = this.authService.getUserIdFromToken();
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

        const enhancedItems = enhanceItemsWithCacheData(
          _.cloneDeep(this.requestForm.value.items),
          this.filteredHistoricalDataOptionsCache(),
          enhancementConfig,
        );

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
          itemsWithValuesJson: JSON.stringify(enhancedItems),
        };

        this.requestService.createRequest(requestData).subscribe(
          (response) => {
            this.dialogRef.close(response);
          },
          () => {
            this.toaster.showError('Error creating request');
          },
        );
      } else {
        this.toaster.showError('Scenario ID is not a number');
      }
    } else {
      this.toaster.showError('Form is invalid');
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
    deliveryAddressId: number,
  ): void {
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
      .open(DeliveryAddressCrudComponent)
      .afterClosed()
      .subscribe((result) => {
        const addressControl = this.requestForm.get('deliveryAddress');
        if (result) {
          this.deliveryAddressService.triggerLoadAllAddresses();
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
