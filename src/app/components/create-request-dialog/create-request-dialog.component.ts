import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
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

@Component({
  selector: 'app-create-request-dialog',
  templateUrl: './create-request-dialog.component.html',
  styleUrls: ['./create-request-dialog.component.css'],
})
export class CreateRequestDialogComponent implements OnInit {
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.currencyCodes().filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  // Signals
  scenarios = toSignal(this.scenarioService.getScenarios());
  selectedScenarioId = signal(0);
  selectedScenario = computed(() => {
    const allSceanrios = this.scenarios();
    const selectedScenarioId = this.selectedScenarioId();

    if (!allSceanrios || selectedScenarioId === 0) return;

    return allSceanrios.find((s) => s.id_scenario === selectedScenarioId);
  });

  scenearioIdSubject = new BehaviorSubject<number>(0);
  scenarioAttributes$ = this.scenearioIdSubject.pipe(
    filter((id: number) => id != 0),
    switchMap((id: number) => this.scenarioService.getScenarioAttributes(id))
  );
  scenarioAttributes = toSignal(this.scenarioAttributes$);

  formItems = computed(() => {
    const selectedScenarioItems: ItemModel[] =
      this.selectedScenario()?.items ?? [];
    const scenarioAttributes: {
      attributeName: string;
      mandatoryFor: string[];
    }[] = this.scenarioAttributes() ?? [];
    const userRole = this.userRole();

    if (
      !selectedScenarioItems.length ||
      !scenarioAttributes.length ||
      !userRole
    )
      return [];

    const mandatoryForUser = userRoleToMandatoryForMapper(userRole);

    return selectedScenarioItems.map((item) => {
      const matchingAttribute = scenarioAttributes.find(
        (attr) => attr.attributeName === item.nameItem
      );
      return {
        ...item,
        isMandatory:
          matchingAttribute && mandatoryForUser
            ? matchingAttribute.mandatoryFor.includes(mandatoryForUser)
            : false,
      };
    });
  });

  existingItemsData = [];

  constructor(
    private fb: FormBuilder,
    private scenarioService: ScenarioService,
    private shippointService: ShippointService,
    private deliveryAddressService: DeliveryAddressService,
    private requestService: RequestService,
    private authService: AuthService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<CreateRequestDialogComponent>
  ) {
    effect(() => {
      const selectedScenario = this.selectedScenario();

      if (!selectedScenario) return;
      this.items?.clear();
      if (this.existingItemsData.length > 0) {
        this.patchExistingData();
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

    if (this.existingItemsData.length > 0) {
      this.patchExistingData();
    } else {
      // this.addItem();
    }
  }

  patchExistingData() {
    this.items.clear();
    this.existingItemsData.forEach((itemData) => {
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
        // isMandatory: [fieldData?.isMandatory]
      });
    });
    console.log(this.fb.group(group));
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

  /******************methodes items*****************/
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
    this.scenearioIdSubject.next(scenarioIdControl?.value ?? 0);
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

  setDeliveryAddress(addressId: number) {}

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
}
