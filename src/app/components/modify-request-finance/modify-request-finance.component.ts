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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import _ from 'lodash';
import { MessageService } from 'primeng/api';
import {
  BehaviorSubject,
  catchError,
  combineLatestWith,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import {
  financeMandatoryFields,
  ItemModel,
  userRoleToMandatoryForMapper,
} from '../../models/request-item.model';
import {
  CURRENCY_CODES,
  INCOTERMES,
  ModeOfTransportEnum,
  RequestModel,
  StandardFieldEnum,
  UpdateFinanceRequestDTO,
} from '../../models/request.model';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { ScenarioService } from '../../services/scenario.service';
import { mergeArrays } from '../../shared/components/tables/helpers';
import { RejectCommentDialogComponent } from '../reject-comment-dialog/reject-comment-dialog.component';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-modify-request-finance',
  templateUrl: './modify-request-finance.component.html',
  styleUrls: ['./modify-request-finance.component.css'],
})
export class ModifyRequestFinanceComponent implements OnInit {
  scenarioService = inject(ScenarioService);

  invoiceTypes: any;
  scenarios: any;
  shipPoints: any;
  incoterms: string[] = INCOTERMES;
  currencyCodes = signal(CURRENCY_CODES);

  requestForm!: FormGroup;
  fb = inject(FormBuilder);
  requestService = inject(RequestService);
  messageService = inject(MessageService);
  authService = inject(AuthService);
  public dialogRef = inject(MatDialogRef<ModifyRequestFinanceComponent>);
  data: { requestNumber: number } = inject(MAT_DIALOG_DATA);
  dialog = inject(MatDialog);
  userRole = inject(UserStoreService).userRole;

  filteredOptions!: Observable<string[]>;

  request$ = this.requestService.getRequestById(this.data.requestNumber).pipe(
    shareReplay(1),
    catchError((err) => {
      this.onNoClick();
      throw err;
    })
  );
  requestModeOfTransport$ = this.request$.pipe(
    filter((request: RequestModel) => request != undefined),
    switchMap((request: RequestModel) => of(request.modeOfTransport))
  );

  requestSig = toSignal(this.request$);
  selectedScenario = computed(() => {
    const request = this.requestSig();
    if (!request) return;
    this.scenearioIdSubject.next(request.scenario.id_scenario);
    return request.scenario;
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
        readOnly: false,
        isMandatory:
          matchingAttribute && mandatoryForUser
            ? matchingAttribute.mandatoryFor.includes(mandatoryForUser)
            : false,
      };
    });
  });

  existingItemsData = computed(() => {
    const request = this.requestSig();
    if (!request) return;
    return request.itemsWithValues;
  });

  ModeOfTransportEnum = ModeOfTransportEnum;

  constructor() {
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

  patchExistingData(data: any[]) {
    this.items.clear();
    data?.forEach((itemData) => {
      this.items.push(this.createItem(itemData));
    });
  }

  onChange(text: string) {
    this.filteredOptions = of(text).pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.currencyCodes().filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  createItem(data?: any): FormGroup {
    const formItems = this.formItems();
    if (!formItems) return this.fb.group({});
    const group: { [key: string]: FormGroup } = {};

    console.log('form items: ', formItems);

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
    let foundData: any = null;
    data?.forEach((d) => {
      if (d['name'] === itemName) foundData = d;
    });

    return foundData;
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      invoicesTypes: [{ value: '', disabled: true }],
      scenarioId: [{ value: '', disabled: true }],
      shippingPoint: [{ value: '', disabled: true }],
      deliveryAddress: [{ value: '', disabled: true }],
      modeOfTransport: [{ value: '', disabled: true }],
      incoterm: ['', Validators.required],
      dhlAccount: [''],
      currency: ['', Validators.required],
      items: this.fb.array([]), // Ajout du FormArray pour les items
    });

    this.requestModeOfTransport$
      .pipe(combineLatestWith(this.request$))
      .subscribe(([modeOfTransport, request]) => {
        if (modeOfTransport == ModeOfTransportEnum.BY_AIR) {
          this.requestForm.patchValue({
            invoicesTypes: request?.invoicesTypes,
            scenarioId: request?.scenario.name,
            shippingPoint: request?.shipPoint.shipPoint,
            modeOfTransport: request?.modeOfTransport,
            deliveryAddress: request?.deliveryAddress?.customerId,
            incoterm: request?.incoterm,
            dhlAccount: request?.dhlAccount,
            currency: request.currency,
          });
        } else {
          this.requestForm.patchValue({
            invoicesTypes: request?.invoicesTypes,
            scenarioId: request?.scenario.name,
            shippingPoint: request?.shipPoint.shipPoint,
            modeOfTransport: request?.modeOfTransport,
            deliveryAddress: request?.deliveryAddress?.customerId,
            incoterm: request?.incoterm,
            currency: request.currency,
          });
        }
      });
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
          value: fieldValue.value, // Assuming fieldValue contains the `value` key
        });
      });
    });
  }

  onSubmit(): void {
    console.log('from value: ', this.requestForm.value);
    if (this.requestForm.valid) {
      const userId = this.authService.getUserIdFromToken();
      const existingItemsData = this.existingItemsData() ?? [];

      const itemsCopy = _.cloneDeep(this.requestForm.value.items);

      const updateData: UpdateFinanceRequestDTO = {
        incoterm: this.requestForm.get('incoterm')?.value,
        dhlAccount: this.requestForm.get('dhlAccount')?.value,
        currency: this.requestForm.get('currency')?.value,
        items: this.items.value.map((item: any) => ({
          id_items: item.id_items,
          unitvaluefinance: item.unitValueFinance,
        })),
        userId: userId,
        itemsWithValuesJson: JSON.stringify(
          mergeArrays(existingItemsData, itemsCopy)
        ),
      };

      this.requestService
        .updateRequestByFinance(this.data.requestNumber, updateData)
        .subscribe(
          (response) => {
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
              detail: 'Error updating request',
            });
            console.error('Error updating request:', error);
          }
        );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Form is invalid',
      });
      console.log('Form is invalid');
    }
  }

  openRejectDialog(): void {
    const dialogRef = this.dialog.open(RejectCommentDialogComponent, {
      width: '300px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((comment) => {
      if (comment) {
        this.onReject(comment);
      }
    });
  }

  onReject(comment: string): void {
    const userId = this.authService.getUserIdFromToken();
    const rejectData = {
      userId: userId,
      comment: comment,
    };

    this.requestService
      .rejectRequest(this.data.requestNumber, rejectData)
      .subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Request rejected successfully',
          });
          console.log('Request rejected:', response);
          this.dialogRef.close(response);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error rejecting request',
          });
          console.error('Error rejecting request:', error);
        }
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
