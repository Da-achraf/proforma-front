import { Component, inject, model, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';
import { delay, filter, switchMap } from 'rxjs';
import { DeliveryAddress, deliveryAddressTableColumns, deliveryAddressTableProperties, emptyDeliveryAddress } from '../../../models/delivery-address.model';
import { TableNameEnum } from '../../../models/table.model';
import { DeliveryAddressService } from '../../../services/delivery-address.service';
import { DeleteConfirmationDialogComponent } from '../../../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { HTTP_REQUEST_DELAY } from '../../../shared/constants/http-requests.constant';
import { ToasterService } from '../../../shared/services/toaster.service';
import { DeliveryAddressCrudComponent } from '../delivery-address-crud/delivery-address-crud.component';

@Component({
  selector: 'app-delivery-address-list',
  templateUrl: './delivery-address-list.component.html',
  styleUrl: './delivery-address-list.component.css',
})
export class DeliveryAddressListComponent implements OnInit {
  deliveryAddressService = inject(DeliveryAddressService);
  snackBar = inject(MatSnackBar);
  messageService = inject(MessageService);
  fb = inject(FormBuilder);
  dialog = inject(MatDialog);
  toastr = inject(ToasterService);

  displayUpdateDialog = model(false);
  displayCreateDialog = model(false);

  deliveryAddress: DeliveryAddress = emptyDeliveryAddress;
  createShipPointForm!: FormGroup;

  deliveryAddresses$ = this.deliveryAddressService
    .getDeliveryAddresses()
    .pipe(delay(HTTP_REQUEST_DELAY));

  tableProperties = deliveryAddressTableProperties;
  tableColumns = deliveryAddressTableColumns;
  TableNameEnum = TableNameEnum;

  ngOnInit(): void {
    this.initializeForm();
  }

  loadDeliveryAddresses() {
    this.deliveryAddresses$ =
      this.deliveryAddressService.getDeliveryAddresses();
  }

  private initializeForm() {
    this.createShipPointForm = this.fb.group({
      shipPoint: ['', Validators.required],
      fullAddress: ['', Validators.required],
      isTe: [true],
    });
  }

  onDelete(id: number) {
    if (!id) return;
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        label: TableNameEnum.DELIVERY_ADDRESS,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() =>
          this.deliveryAddressService.deleteDeliveryAddress(id)
        )
      )
      .subscribe({
        next: () => {
          this.showSuccess('Delivery Address Deleted Successfully.');
          this.loadDeliveryAddresses();
        },
        error: () => {
          this.showError('Error in deleting delivery address');
        },
      });
  }

  onUpdate(deliveryAddress: DeliveryAddress): void {
    // this.shipPoint = shipPoint
    // this.displayUpdateDialog.set(true)

    const dialogRef = this.dialog.open(DeliveryAddressCrudComponent, {
      width: '800px',
      data: {
        isUpdateMode: true,
        deliveryAddress,
      },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadDeliveryAddresses();
      }
    });
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(DeliveryAddressCrudComponent, {
      width: '800px',
      data: {
        isUpdateMode: false,
      },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadDeliveryAddresses();
      }
    });
  }

  updateShipPoint(): void {
    this.deliveryAddressService
      .updateDeliveryAddress(this.deliveryAddress.id, this.deliveryAddress)
      .subscribe(
        () => {
          this.showSuccess('Delivery Address updated successfully!');
          this.displayUpdateDialog.set(false);
          this.loadDeliveryAddresses();
        },
        (error) => {
          console.error('Error updating departement:', error);
        }
      );
  }

  private showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  private showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }
}
