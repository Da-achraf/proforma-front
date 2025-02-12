import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import _ from 'lodash';
import { MessageService } from 'primeng/api';
import { catchError, map, Observable, of, shareReplay, startWith } from 'rxjs';
import { DeliveryAddress } from '../../models/delivery-address.model';
import {
  ItemModel,
  userRoleToMandatoryForMapper,
} from '../../models/request-item.model';
import {
  CURRENCY_CODES,
  INCOTERMES,
  INVOICE_TYPES,
  ModesOfTransports,
  RequestModel,
  SHIPPED_VIA_OPTIONS,
  UpdateRequestByRequester,
} from '../../models/request.model';
import { Ship } from '../../models/ship.model';
import { DeliveryAddressService } from '../../services/delivery-address.service';
import { RequestService } from '../../services/request.service';
import { ScenarioService } from '../../services/scenario.service';
import { ShippointService } from '../../services/shippoint.service';
import { UserStoreService } from '../../services/user-store.service';
import { mergeArrays } from '../../shared/components/tables/helpers';
import { ToasterService } from '../../shared/services/toaster.service';
import { CreateRequestDialogComponent } from '../create-request-dialog/create-request-dialog.component';
import { DeliveryAddressCrudComponent } from '../delivery-address/delivery-address-crud/delivery-address-crud.component';

@Component({
  selector: 'app-edit-request-requester',
  templateUrl: './edit-request-requester.component.html',
  styleUrl: './edit-request-requester.component.css',
})
export class EditRequestRequesterComponent {
  // Injected dependencies
  dialog = inject(MatDialog);
  toastr = inject(ToasterService);

  requestForm!: FormGroup;

  shipPoints: Ship[] = [];
  deliveryAddresses: DeliveryAddress[] = [];

  currencyCodes = signal<string[]>(CURRENCY_CODES);
  invoiceTypes = signal<string[]>(INVOICE_TYPES);
  incotermOptions = signal<string[]>(INCOTERMES);
  shippedViaOptions = signal<string[]>(SHIPPED_VIA_OPTIONS);
  modesOfTransports: string[] = ModesOfTransports;
  userRole = inject(UserStoreService).userRole;

  filteredOptions!: Observable<string[]>;

  data: { requestNumber: number } = inject(MAT_DIALOG_DATA);
  request$ = this.requestService.getRequestById(this.data.requestNumber).pipe(
    shareReplay(1),
    catchError((err) => {
      this.onNoClick();
      throw err;
    })
  );
  requestSig = toSignal(this.request$);

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.currencyCodes().filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  // Signals and computed values
  scenarios = toSignal(this.scenarioService.getScenarios());
  selectedScenarioId = signal(0);
  selectedScenarioChanged = signal<number | undefined>(undefined);

  patchedScenario = computed(() => this.requestSig()?.scenario);

  selectedScenario = computed(() =>
    this.scenarios()?.find((s) => s.id_scenario === this.selectedScenarioId())
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
            ? item.mandatoryFor?.includes(mandatoryForUser) ?? false
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
    private deliveryAddressService: DeliveryAddressService,
    private requestService: RequestService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<CreateRequestDialogComponent>
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
    this.selectedScenarioChanged.set(scenarioIdControl?.value ?? undefined);
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

        const existingItemsData = this.existingItemsData() ?? [];
        const itemsCopy = _.cloneDeep(this.requestForm.value.items);

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
            mergeArrays(existingItemsData, itemsCopy)
          ),
        };

        this.requestService
          .updateRequestByRequester(this.data.requestNumber, requestData)
          .subscribe(
            (response) => {
              console.log('Request created:', response);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Request updated successfully',
              });
              this.dialogRef.close(true);
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error editing the request',
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

  updateIncoterm(shippingPointId: number, deliveryAddressId: number): void {
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
      .open(DeliveryAddressCrudComponent, {
        data: {
          makeFieldsMandatory: true,
        },
      })
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
}
