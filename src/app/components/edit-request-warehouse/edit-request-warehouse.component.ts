import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { MessageService } from 'primeng/api'; // Import MessageService
import { CreateRequest, Item } from '../../models/request.model';

@Component({
  selector: 'app-edit-request-warehouse',
  templateUrl: './edit-request-warehouse.component.html',
  styleUrls: ['./edit-request-warehouse.component.css']
})
export class EditRequestWarehouseComponent implements OnInit {
  requestForm: FormGroup;

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
    this.requestForm = this.fb.group({
      invoicesTypes: [{ value: '', disabled: true }],
      shippingPoint: [{ value: '', disabled: true }],
      deliveryAddress: [{ value: '', disabled: true }],
      incoterm: [{ value: '', disabled: true }],
      dhlAccount: [{ value: '', disabled: true }],
      htsCode: [{ value: '', disabled: true }],
      coo: [{ value: '', disabled: true }],
      trackingNumber: ['', Validators.required],
      numberOfBoxes: ['', Validators.required],
      weight: ['', Validators.required],
      modeOfTransport: ['', Validators.required],
      shippedVia: ['', Validators.required],
      items: this.fb.array([]) // FormArray for items
    });
  }

  ngOnInit(): void {
    this.requestService.getRequestById(this.data.requestNumber).subscribe(
      (request: any) => {
          console.log('req: ',request )
        this.requestForm.patchValue({
          invoicesTypes: request.invoicesTypes,
          shippingPoint: request.shippingPoint,
          deliveryAddress: request.deliveryAddress,
          incoterm: request.incoterm,
          dhlAccount: request.dhlAccount,
          htsCode: request.htsCode,
          coo: request.coo,
          trackingNumber: request.trackingNumber,
          numberOfBoxes: request.numberOfBoxes,
          weight: request.weight,
          modeOfTransport: request.modeOfTransport,
          shippedVia: 'DHLL'
        });

        // Populate items
        (request.items || []).forEach((item: any) => this.addItem(item));
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
        trackingNumber: this.requestForm.get('trackingNumber')?.value,
        numberOfBoxes: this.requestForm.get('numberOfBoxes')?.value,
        weight: this.requestForm.get('weight')?.value,
        modeoftransport: this.requestForm.get('modeoftransport')?.value,
        shippedvia: this.requestForm.get('shippedvia')?.value,
        userId: userId
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
}
