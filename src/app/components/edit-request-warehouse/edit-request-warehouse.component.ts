import { Component, computed, effect, ElementRef, inject, Inject, OnInit, signal, Signal, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { MessageService } from 'primeng/api'; // Import MessageService
import { CURRENCY_CODES, RequestModel, StandardFieldEnum } from '../../models/request.model';
import { BehaviorSubject, filter, map, Observable, of, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ItemModel } from '../../models/request-item.model';
import { ScenarioService } from '../../services/scenario.service';
import { mergeArrays } from '../../shared/components/tables/helpers';
import _ from 'lodash'
import { MatAutocomplete } from '@angular/material/autocomplete';
import { notZeroValidator } from '../../shared/helpers/form-validator.helper';
import { ParcelsComponent } from '../../shared/components/parcels/parcels.component';

@Component({
  selector: 'app-edit-request-warehouse',
  templateUrl: './edit-request-warehouse.component.html',
  styleUrls: ['./edit-request-warehouse.component.css']
})
export class EditRequestWarehouseComponent implements OnInit {
  requestForm!: FormGroup;

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') auto!: MatAutocomplete;


  scenarioService = inject(ScenarioService)
  currencyCodes = signal(CURRENCY_CODES)

  modeOfTransport = computed(() => {
    const request = this.requestSig()
    if (!request) return
    return request.modeOfTransport
  })

  existingItemsData = computed(() => {
    const request = this.requestSig()
    if (!request) return
    return request.itemsWithValues
  })

  
  request$ = this.requestService.getRequestById(this.data.requestNumber).pipe(
    shareReplay(1)
  )

  requestSig = toSignal(this.request$)

  selectedScenario = computed(() => {
    const request = this.requestSig()
    if (!request) return
    this.scenearioIdSubject.next(request.scenario.id_scenario)
    return request.scenario
  })

  scenearioIdSubject = new BehaviorSubject<number>(0)
  scenarioAttributes$ = this.scenearioIdSubject.pipe(
    filter((id: number) => id != 0),
    switchMap((id: number) => this.scenarioService.getScenarioAttributes(id))
  )
  scenarioAttributes = toSignal(this.scenarioAttributes$)

  formItems = computed(() => {
    const selectedScenarioItems: ItemModel[] = this.selectedScenario()?.items ?? [];
    const scenarioAttributes: { attributeName: string; isMandatory: boolean; }[] = this.scenarioAttributes() ?? [];
  
    if (!selectedScenarioItems.length || !scenarioAttributes.length) return [];
  
    return selectedScenarioItems.map(item => {
      const matchingAttribute = scenarioAttributes.find(attr => attr.attributeName === item.nameItem);
      return {
        ...item,
        readOnly: (item.nameItem != StandardFieldEnum.GROSS_WEIGHT && item.nameItem != StandardFieldEnum.NET_WEIGHT),
        // isMandatory: matchingAttribute ? matchingAttribute.isMandatory : (item.isMandatory ?? false),
        isMandatory: true,
      };
    });
  });

  filteredOptions!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private router: Router,
    private authService: AuthService,
    public dialogRef: MatDialogRef<EditRequestWarehouseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { requestNumber: number },
    private dialog: MatDialog,
    private messageService: MessageService // Inject MessageService
  ) {

    effect(() => {
      const formItems = this.formItems()
      const existingItemsData = this.existingItemsData()


      console.log('Existing item data: ', existingItemsData)

      if (existingItemsData?.length == 0) return
      this.items?.clear()
      if (existingItemsData && existingItemsData.length > 0) {
        this.patchExistingData(existingItemsData);
      } else {
        this.addItem();
      }
    })
  }


  ngOnInit(): void {
    this.requestForm = this.fb.group({
      invoicesTypes: [{ value: '', disabled: true }],
      shippingPoint: [{ value: '', disabled: true }],
      deliveryAddress: [{ value: '', disabled: true }],
      incoterm: [{ value: '', disabled: true }],
      dhlAccount: [{ value: '', disabled: true }],
      trackingNumber: ['', Validators.required],
      grossWeight: ['', [Validators.required, notZeroValidator()]],
      dimension: ['', Validators.required],
      currency: ['', Validators.required],
      modeOfTransport: [{value: '', disabled: true}],
      shippedVia: [{value: '', disabled: true}],
      items: this.fb.array([]) // FormArray for items
    });


    this.requestService.getRequestById(this.data.requestNumber).subscribe(
      (request: RequestModel) => {
          console.log('req: ',request )
        this.requestForm.patchValue({
          invoicesTypes: request.invoicesTypes,
          shippingPoint: request?.shipPoint.shipPoint,
          modeOfTransport: request?.modeOfTransport,
          deliveryAddress: request?.deliveryAddress.deliveryAddress,
          incoterm: request.incoterm,
          dhlAccount: request.dhlAccount,
          trackingNumber: request.trackingNumber,
          grossWeight: request.grossWeight,
          dimension: request.dimension,
          boxes: request.boxes,
          pallets: request.pallets,
          shippedVia: request.shippedVia,
          currency: request.currency
        });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching request data' });
        console.error('Error fetching request data:', error);
      }
    );
  }

  patchExistingData(data: any[]) {
    this.items.clear();
    data?.forEach(itemData => {
      this.items.push(this.createItem(itemData));
    });
  }

  createItem(data?: any): FormGroup {
    const formItems = this.formItems()
    if (!formItems) return this.fb.group({});
    const group: { [key: string]: FormGroup } = {};

    formItems.forEach((item: ItemModel) => {
      const fieldData = this.findDataOfItem(item.nameItem, data?.values) ?? undefined;
      group[item.nameItem] = this.fb.group({
        name: item.nameItem,
        value: [fieldData ? fieldData?.value : '', (fieldData?.isMandatory || item.isMandatory) ? Validators.required : null],
        type: [fieldData ? fieldData?.type : item.type],
        isMandatory: [fieldData?.isMandatory]
      });
    });
    return this.fb.group(group);
  }

  findDataOfItem(itemName: string, data: any[]) {
    let foundData:any = null
    data?.forEach(d => {
      if (d['name'] === itemName) {
        console.log('foudn data: ', d, itemName)
        foundData = d
      }
    })

    return foundData
  }

  get items(): FormArray {
    return this.requestForm.get('items') as FormArray;
  }

  fieldsArray(index: number): FormArray {
    return this.items.at(index).get('fields') as FormArray;
  }

  patchValuesToFormArray(values: any[]) {
    const itemsArray = this.requestForm.get('items') as FormArray;
  
    values.forEach((itemValue, itemIndex) => {
      const itemGroup = itemsArray.at(itemIndex) as FormGroup;
      const fieldsArray = itemGroup.get('fields') as FormArray;
  
      itemValue.fields.forEach((fieldValue: any, fieldIndex: number) => {
        const fieldGroup = fieldsArray.at(fieldIndex) as FormGroup;
        fieldGroup?.patchValue({
          value: fieldValue.value // Assuming fieldValue contains the `value` key
        });
      });
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      const userId = this.authService.getUserIdFromToken();
      const existingItemsData = this.existingItemsData() ?? []
      const itemsCopy = _.cloneDeep(this.requestForm.value.items)

      const updateData = {
        trackingNumber: this.requestForm.get('trackingNumber')?.value,
        grossWeight: this.requestForm.get('grossWeight')?.value,
        dimension: this.requestForm.get('dimension')?.value,
        currency: this.requestForm.get('currency')?.value,
        itemsWithValuesJson: JSON.stringify(mergeArrays(existingItemsData, itemsCopy)),
        userId: userId,
        boxes: this.requestForm.get('boxes')?.value,
        pallets: this.requestForm.get('pallets')?.value,
      };

      this.requestService.updateRequestByWarehouse(this.data.requestNumber, updateData).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Request updated successfully' });
          console.log('Request updated:', response);
          this.dialogRef.close(true);
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating request' });
          console.error('Error updating request:', error);
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Form is invalid' });
      console.log('Form is invalid');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.currencyCodes().filter(option => option.toLowerCase().includes(filterValue));
  }

  onCurrencyChange(text: string) {
    this.filteredOptions = of(text).pipe(
      startWith(''),
      map((value: string) => this._filter(value || ''))
    );
  }

  compareCurrency(c1: string, c2: string): boolean {
    return c1 === c2;
  }

  filter(): void {
    const filterValue = this.input?.nativeElement.value.toLowerCase();
    this.filteredOptions = of(this.currencyCodes().filter(o => o.toLowerCase().includes(filterValue)));
  }
}
