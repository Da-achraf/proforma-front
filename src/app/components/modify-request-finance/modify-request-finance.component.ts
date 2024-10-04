import { Component, computed, effect, inject, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { RejectCommentDialogComponent } from '../reject-comment-dialog/reject-comment-dialog.component';
import { MessageService } from 'primeng/api';
import { INCOTERMES, Item, ModeOfTransportEnum, RequestModel, UpdateFinanceRequestDTO } from '../../models/request.model';
import { combineLatestWith, filter, of, shareReplay, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-modify-request-finance',
  templateUrl: './modify-request-finance.component.html',
  styleUrls: ['./modify-request-finance.component.css']
})
export class ModifyRequestFinanceComponent implements OnInit {
  invoiceTypes: any
  scenarios: any
  shipPoints: any
  incoterms: string[] = INCOTERMES

  requestForm!: FormGroup;
  fb = inject(FormBuilder)
  requestService =inject(RequestService)
  messageService = inject(MessageService)
  authService = inject(AuthService)
  public dialogRef = inject(MatDialogRef<ModifyRequestFinanceComponent>)
  data: {requestNumber: number} = inject(MAT_DIALOG_DATA)
  dialog = inject(MatDialog)

  request$ = this.requestService.getRequestById(this.data.requestNumber).pipe(
    shareReplay(1)
  )
  requestModeOfTransport$ = this.request$.pipe(
    filter((request: RequestModel) => request != undefined),
    switchMap((request: RequestModel) => of(request.modeOfTransport))
  )

  ModeOfTransportEnum = ModeOfTransportEnum

  constructor() {
    this.requestForm = this.fb.group({
      invoicesTypes: [{ value: '', disabled: true }],
      scenarioId: [{ value: '', disabled: true }],
      shippingPoint: [{ value: '', disabled: true }],
      deliveryAddress: [{ value: '', disabled: true }],
      modeOfTransport: [{ value: '', disabled: true}],
      incoterm: ['', Validators.required],
      dhlAccount: ['', Validators.required],
      items: this.fb.array([]) // Ajout du FormArray pour les items
    });

    // effect(() => {      
    //   const requestModeOfTransport = this.requestModeOfTransport()
    //   const request = this.request()
    //   console.log('requestModeOfTransport: ', requestModeOfTransport)
    //   if (requestModeOfTransport === ModeOfTransportEnum.BY_AIR){
    //     this.requestForm = this.fb.group({
    //       invoicesTypes: [{ value: '', disabled: true }],
    //       scenarioId: [{ value: '', disabled: true }],
    //       shippingPoint: [{ value: '', disabled: true }],
    //       deliveryAddress: [{ value: '', disabled: true }],
    //       modeOfTransport: request?.modeOfTransport,
    //       incoterm: ['', Validators.required],
    //       dhlAccount: ['', Validators.required],
    //       items: this.fb.array([]) // Ajout du FormArray pour les items
    //     });
    //   }else {
    //     this.requestForm = this.fb.group({
    //       invoicesTypes: [{ value: '', disabled: true }],
    //       scenarioId: [{ value: '', disabled: true }],
    //       shippingPoint: [{ value: '', disabled: true }],
    //       deliveryAddress: [{ value: '', disabled: true }],
    //       incoterm: ['', Validators.required],
    //       items: this.fb.array([]) // Ajout du FormArray pour les items
    //     });
    //   }
    // })
  }

  ngOnInit(): void {

    this.requestModeOfTransport$.pipe(
      combineLatestWith(this.request$)
    ).pipe(
      tap(console.log)
    )
    .subscribe(([modeOfTransport, request]) => {
      if (modeOfTransport == ModeOfTransportEnum.BY_AIR){
        this.requestForm.patchValue({
          invoicesTypes: request?.invoicesTypes,
          scenarioId: request?.scenarioId,
          shippingPoint: request?.shipPoint.shipPoint,
          modeOfTransport: request?.modeOfTransport,
          deliveryAddress: request?.deliveryAddress.deliveryAddress,
          incoterm: request?.incoterm,
          dhlAccount: request?.dhlAccount
        });
      }else{
        this.requestForm.patchValue({
          invoicesTypes: request?.invoicesTypes,
          scenarioId: request?.scenarioId,
          shippingPoint: request?.shipPoint.shipPoint,
          modeOfTransport: request?.modeOfTransport,
          deliveryAddress: request?.deliveryAddress.deliveryAddress,
          incoterm: request?.incoterm,
        });
      }

      (request.items || []).forEach((item: any) => this.addItem(item));
    })
    
    
    // if (modeOfTransport == ModeOfTransportEnum.BY_AIR){
    //   this.requestForm.patchValue({
    //     invoicesTypes: request?.invoicesTypes,
    //     scenarioId: request?.scenarioId,
    //     shippingPoint: request?.shipPoint.shipPoint,
    //     modeOfTransport: request?.modeOfTransport,
    //     deliveryAddress: request?.deliveryAddress.deliveryAddress,
    //     incoterm: request?.incoterm,
    //     dhlAccount: request?.dhlAccount
    //   });
    // }else{
    //   this.requestForm.patchValue({
    //     invoicesTypes: request?.invoicesTypes,
    //     scenarioId: request?.scenarioId,
    //     shippingPoint: request?.shipPoint.shipPoint,
    //     modeOfTransport: request?.modeOfTransport,
    //     deliveryAddress: request?.deliveryAddress.deliveryAddress,
    //     incoterm: request?.incoterm,
    //   });
    // }

    // this.requestService.getRequestById(this.data.requestNumber).subscribe(
    //   (request: RequestModel) => {
    //     this.requestForm.patchValue({
    //       invoicesTypes: request.invoicesTypes,
    //       shippingPoint: request.shipPoint.shipPoint,
    //       deliveryAddress: request.deliveryAddress.deliveryAddress,
    //       incoterm: request.incoterm,
    //       modeOfTransport: request.modeOfTransport,
    //       dhlAccount: request.dhlAccount,
    //       htsCode: request.htsCode,
    //       coo: request.coo
    //     });
    //   // Patch items
    //   (request.items || []).forEach(item => this.addItem(item));
    //         },
    //         (error) => {
    //           this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching request data' });
    //           console.error('Error fetching request data:', error);
    //         }
    //   );
  }


  // ngOnInit(): void {
  //   this.requestService.getRequestById(this.data.requestNumber).subscribe(
  //     (request: RequestModel) => {
  //       this.requestForm.patchValue({
  //         invoicesTypes: request.invoicesTypes,
  //         scenarioId: request.scenarioId,
  //         shippingPoint: request.shipPoint.shipPoint,
  //         deliveryAddress: request.deliveryAddress.deliveryAddress,
  //         incoterm: request.incoterm,
  //         dhlAccount: request.dhlAccount
  //       });

  //       // Patch items
  //       (request.items || []).forEach(item => this.addItem(item));
  //     },
  //     (error) => {
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching request data' });
  //       console.error('Error fetching request data:', error);
  //     }
  //   );
  // }

  get items(): FormArray {
    return this.requestForm.get('items') as FormArray;
  }

  addItem(item: Item): void {
    this.items.push(this.fb.group({
      id_items: [item.id_items],
      pn: [{ value: item.pn, disabled: true }],
      quantity: [{ value: item.quantity, disabled: true }],
      unitOfQuantity: [{ value: item.unitofquantity, disabled: true }],
      unitValueFinance: [item.unitvaluefinance, Validators.required],
      description: [{ value: item.description, disabled: true }],
      costCenter: [{ value: item.costcenter, disabled: true }],
      businessUnit: [{ value: item.businessunit, disabled: true }],
      plant: [{ value: item.plant, disabled: true }]
    }));
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      const userId = this.authService.getUserIdFromToken();
      const updateData: UpdateFinanceRequestDTO = {
        incoterm: this.requestForm.get('incoterm')?.value,
        dhlAccount: this.requestForm.get('dhlAccount')?.value,
        items: this.items.value.map((item: any) => ({
          id_items: item.id_items,
          unitvaluefinance: item.unitValueFinance
        })),
        userId: userId
      };

      this.requestService.updateRequestByFinance(this.data.requestNumber, updateData).subscribe(
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

  onNoClick(): void {
    this.dialogRef.close();
  }
}
