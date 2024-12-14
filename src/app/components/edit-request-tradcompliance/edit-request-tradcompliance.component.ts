import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import _, { get } from 'lodash';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, filter, map, Observable, of, shareReplay, startWith, switchMap } from 'rxjs';
import { FieldTypeEnum, ItemModel } from '../../models/request-item.model';
import { CURRENCY_CODES, RequestModel } from '../../models/request.model';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { ScenarioService } from '../../services/scenario.service';
import { mergeArrays } from '../../shared/components/tables/helpers';
import { RejectCommentDialogComponent } from '../reject-comment-dialog/reject-comment-dialog.component';

@Component({
  selector: 'app-edit-request-tradcompliance',
  templateUrl: './edit-request-tradcompliance.component.html',
  styleUrls: ['./edit-request-tradcompliance.component.css']
})
export class EditRequestTradcomplianceComponent implements OnInit {
  requestForm!: FormGroup;
  fb = inject(FormBuilder)
  requestService =inject(RequestService)
  scenarioService = inject(ScenarioService)
  messageService = inject(MessageService)
  authService = inject(AuthService)
  public dialogRef = inject(MatDialogRef<EditRequestTradcomplianceComponent>)
  data: {requestNumber: number} = inject(MAT_DIALOG_DATA)
  dialog = inject(MatDialog)

  currencyCodes = signal(CURRENCY_CODES)
  filteredOptions!: Observable<string[]>;

  additionalItems: ItemModel[] = [
    {
      nameItem: 'HTS Code',
      type: FieldTypeEnum.TEXT,
      isMandatory: true
    },
    {
      nameItem: 'COO',
      type: FieldTypeEnum.TEXT,
      isMandatory: true
    }
  ]

  request$ = this.requestService.getRequestById(this.data.requestNumber).pipe(
    shareReplay(1)
  )

  requestSig = toSignal(this.request$)

  modeOfTransport = computed(() => {
    const request = this.requestSig()
    if (!request) return
    return request.modeOfTransport
  })

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
  
    const items = selectedScenarioItems.map(item => {
      const matchingAttribute = scenarioAttributes.find(attr => attr.attributeName === item.nameItem);
      return {
        ...item,
        readOnly: (item.nameItem != 'HTS Code' && item.nameItem != 'COO'),
        isMandatory: matchingAttribute ? matchingAttribute.isMandatory : (item.isMandatory ?? false)
      };
    });

    return [...items, ...this.additionalItems]
  });

  existingItemsData = computed(() => {
    const request = this.requestSig()
    if (!request) return
    return request.itemsWithValues
  })

  constructor() {
    effect(() => {
      const formItems = this.formItems()
      const existingItemsData = this.existingItemsData()


      if (existingItemsData?.length == 0) return
      this.items?.clear()
      if (existingItemsData && existingItemsData.length > 0) {
        this.patchExistingData(existingItemsData);
      } else {
        this.addItem();
      }
    })
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
      if (item.nameItem == 'COO'){
        group[item.nameItem] = this.fb.group({
          name: item.nameItem,
          value: [fieldData ? {'alpha2Code': fieldData.value} : '', (fieldData?.isMandatory || item.isMandatory) ? Validators.required : null],
          type: [fieldData ? fieldData?.type : item.type],
          isMandatory: [fieldData?.isMandatory]
        });
      }
      else {
        group[item.nameItem] = this.fb.group({
          name: item.nameItem,
          value: [fieldData ? fieldData?.value : '', (fieldData?.isMandatory || item.isMandatory) ? Validators.required : null],
          type: [fieldData ? fieldData?.type : item.type],
          isMandatory: [fieldData?.isMandatory]
        });
      }
      
    });
    console.log(this.fb.group(group))
    return this.fb.group(group);
  }

  findDataOfItem(itemName: string, data: any[]) {
    console.log('data: ', data)
    let foundData:any = null
    data?.forEach(d => {
      if (d['name'] === itemName) foundData = d
    })

    return foundData
  }

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      invoicesTypes: [{ value: '', disabled: true }],
      scenarioId: [{ value: '', disabled: true }],
      shippingPoint: [{ value: '', disabled: true }],
      deliveryAddress: [{ value: '', disabled: true }],
      modeOfTransport: [{ value: '', disabled: true }],
      incoterm: [{ value: '', disabled: true }],
      currency: ['', Validators.required],
      dhlAccount: [{ value: '', disabled: true }],
      items: this.fb.array([]) // Ajout du FormArray pour les items
    });

    this.requestService.getRequestById(this.data.requestNumber).subscribe(
      (request: RequestModel) => {
        this.requestForm.patchValue({
          invoicesTypes: request.invoicesTypes,
          shippingPoint: request.shipPoint.shipPoint,
          deliveryAddress: request.deliveryAddress.deliveryAddress,
          incoterm: request.incoterm,
          currency: request.currency,
          modeOfTransport: request.modeOfTransport,
          dhlAccount: request.dhlAccount,
        });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching request data' });
        console.error('Error fetching request data:', error);
      }
    );
  }

  get items(): FormArray {
    return this.requestForm.get('items') as FormArray;
  }

  fieldsArray(index: number): FormArray {
    return this.items.at(index).get('fields') as FormArray;
  }

  addItem() {
    this.items.push(this.createItem());
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      const userId = this.authService.getUserIdFromToken();
      const existingItemsData = this.existingItemsData() ?? []
      let itemsCopy = transformCooValue(_.cloneDeep(this.requestForm.value.items))
      
      const updateData = {
        itemsWithValuesJson: JSON.stringify(mergeArrays(existingItemsData, itemsCopy)),
        currency: this.requestForm.value.currency,
        userId: userId
      };

      this.requestService.updateRequestByTradCompliance(this.data.requestNumber, updateData).subscribe(
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
      console.error('Form is invalid');
    }
  }

  openRejectDialog(): void {
    const dialogRef = this.dialog.open(RejectCommentDialogComponent, {
      width: '300px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(comment => {
      if (comment) {
        this.onReject(comment);
      }
    });
  }

  patchValuesToFormArray(values: any[]) {
    const itemsArray = this.requestForm.get('items') as FormArray;
  
    values.forEach((itemValue, itemIndex) => {
      const itemGroup = itemsArray.at(itemIndex) as FormGroup;
      const fieldsArray = itemGroup.get('fields') as FormArray;
  
      itemValue.fields.forEach((fieldValue: any, fieldIndex: number) => {
        const fieldGroup = fieldsArray.at(fieldIndex) as FormGroup;
        fieldGroup.patchValue({
          value: fieldValue.value // Assuming fieldValue contains the `value` key
        });
      });
    });
  }

  onReject(comment: string): void {
    const userId = this.authService.getUserIdFromToken();
    const rejectData = {
      userId: userId,
      comment: comment
    };

    this.requestService.rejectRequest(this.data.requestNumber, rejectData).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Request rejected successfully' });
        console.log('Request rejected:', response);
        this.dialogRef.close(response);
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error rejecting request' });
        console.error('Error rejecting request:', error);
      }
    );
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

  onNoClick(): void {
    this.dialogRef.close();
  }
}

function transformCooValue(items: any[]): any[] {
  return items.map((item) => ({
    ...item,
    COO: {
      ...item.COO,
      value: get(item, 'COO.value.alpha2Code', null),
    },
  }));
}
