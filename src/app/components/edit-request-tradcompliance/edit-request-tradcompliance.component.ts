import { Component, computed, inject, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { RejectCommentDialogComponent } from '../reject-comment-dialog/reject-comment-dialog.component';
import { MessageService } from 'primeng/api';
import { Item, RequestModel } from '../../models/request.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-edit-request-tradcompliance',
  templateUrl: './edit-request-tradcompliance.component.html',
  styleUrls: ['./edit-request-tradcompliance.component.css']
})
export class EditRequestTradcomplianceComponent implements OnInit {
  requestForm: FormGroup;
  fb = inject(FormBuilder)
  requestService =inject(RequestService)
  messageService = inject(MessageService)
  authService = inject(AuthService)
  public dialogRef = inject(MatDialogRef<EditRequestTradcomplianceComponent>)
  data: {requestNumber: number} = inject(MAT_DIALOG_DATA)
  dialog = inject(MatDialog)

  constructor() {
    this.requestForm = this.fb.group({
      invoicesTypes: [{ value: '', disabled: true }],
      scenarioId: [{ value: '', disabled: true }],
      shippingPoint: [{ value: '', disabled: true }],
      deliveryAddress: [{ value: '', disabled: true }],
      modeOfTransport: [{ value: '', disabled: true }],
      incoterm: [{ value: '', disabled: true }],
      dhlAccount: [{ value: '', disabled: true }],
      htsCode: ['', Validators.required],
      coo: ['', Validators.required],
      items: this.fb.array([]) // Ajout du FormArray pour les items
    });
  }

  ngOnInit(): void {
    this.requestService.getRequestById(this.data.requestNumber).subscribe(
      (request: RequestModel) => {
        this.requestForm.patchValue({
          invoicesTypes: request.invoicesTypes,
          shippingPoint: request.shipPoint.shipPoint,
          deliveryAddress: request.deliveryAddress.deliveryAddress,
          incoterm: request.incoterm,
          modeOfTransport: request.modeOfTransport,
          dhlAccount: request.dhlAccount,
          htsCode: request.htsCode,
          coo: request.coo
        });
// Patch items
(request.items || []).forEach(item => this.addItem(item));
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

  addItem(item: Item): void {
    this.items.push(this.fb.group({
      pn: [{ value: item.pn, disabled: true }],
      quantity: [{ value: item.quantity, disabled: true }],
      unitOfQuantity: [{ value: item.unitofquantity, disabled: true }],
      unitValueFinance: [{ value: item.unitvaluefinance, disabled: true }],
      description: [{ value: item.description, disabled: true }],
      costCenter: [{ value: item.costcenter, disabled: true }],
      businessUnit: [{ value: item.businessunit, disabled: true }],
      plant: [{ value: item.plant, disabled: true }]
    }));
  }
  onSubmit(): void {
    if (this.requestForm.valid) {
      const userId = this.authService.getUserIdFromToken();
      const updateData = {
        htsCode: this.requestForm.get('htsCode')?.value,
        coo: this.requestForm.get('coo')?.value,
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
