import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import {
  DeliveryAddress,
  DeliveryAddressCreate,
} from '../../../models/delivery-address.model';
import { DeliveryAddressService } from '../../../services/delivery-address.service';
import { ToasterService } from '../../../shared/services/toaster.service';

@Component({
  selector: 'app-delivery-address-crud',
  templateUrl: './delivery-address-crud.component.html',
  styleUrl: './delivery-address-crud.component.css',
})
export class DeliveryAddressCrudComponent implements OnInit {
  // Injected dependencies
  private fb = inject(FormBuilder);
  private deliveryAddressService = inject(DeliveryAddressService);
  private dialogRef = inject(MatDialogRef<DeliveryAddressCrudComponent>);
  private toastr = inject(ToasterService);
  private data = signal(inject(MAT_DIALOG_DATA));

  // Component properties
  form!: FormGroup;

  // Component signals and computed values
  isFormSubmited = signal(false);
  isUpdateMode = computed(() => this.data()?.isUpdateMode);
  deliveryAddress = computed<DeliveryAddress | undefined>(
    () => this.data()?.deliveryAddress
  );

  formHeaderText = computed(() => {
    return this.isUpdateMode()
      ? 'Update a delivery address'
      : 'Register a new delivery address';
  });

  deliveryAddressEffect = effect(() => {
    const deliveryAddress = this.deliveryAddress();
    if (!deliveryAddress) return;

    this.patchDeliveryAddressFormValue(deliveryAddress);
  });

  // Component hooks
  ngOnInit(): void {
    this.initializeForm();
  }

  // Component methods
  private initializeForm() {
    this.form = this.fb.group({
      customerId: ['', Validators.required],
      companyName: [''],
      street: [''],
      zipCode: [''],
      country: [''],
      fullAddress: [''],
      vat: [''],
      isTe: [false],
    });
  }

  patchDeliveryAddressFormValue(address: DeliveryAddress) {
    this.form.patchValue(address);
  }

  createDeliveryAddress() {
    if (this.form.valid) {
      this.isFormSubmited.set(true);
      const newDeliveryAddress: DeliveryAddressCreate = this.form.getRawValue();

      this.deliveryAddressService
        .CreateDeliveryAddress(newDeliveryAddress)
        .pipe(finalize(() => this.isFormSubmited.set(false)))
        .subscribe({
          next: (address: DeliveryAddress) => {
            this.toastr.showSuccessMessage(
              'Delivery address added successfully'
            );
            this.dialogRef.close(address.id);
            this.resetForm();
          },
          error: (error) => {
            this.toastr.showErrorMessage('Unknown error occured');
          },
        });
    }
  }

  resetForm() {
    this.form.reset();
  }
}
