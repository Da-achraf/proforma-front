import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  DeliveryAddress,
  DeliveryAddressCreate,
} from '../../../core/models/delivery-address.model';

@Component({
  selector: 'app-delivery-address-crud',
  templateUrl: './delivery-address-crud.component.html',
  styleUrl: './delivery-address-crud.component.css',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInput,
    MatDialogModule,
    MatButtonModule,
  ],
})
export class DeliveryAddressCrudComponent implements OnInit {
  // Injected dependencies
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<DeliveryAddressCrudComponent>);
  private data = signal(inject(MAT_DIALOG_DATA));

  // Component properties
  form!: FormGroup;

  // Component signals and computed values
  isFormSubmited = signal(false);
  isUpdateMode = computed(() => this.data()?.isUpdateMode);
  deliveryAddress = computed<DeliveryAddress | undefined>(
    () => this.data()?.deliveryAddress,
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

  makeFieldsMandatory = computed(() => this.data()?.makeFieldsMandatory);

  // Component hooks
  ngOnInit(): void {
    this.initializeForm();
  }

  // Component methods
  private initializeForm() {
    if (this.makeFieldsMandatory()) {
      this.form = this.fb.group({
        customerId: ['', Validators.required],
        companyName: ['', Validators.required],
        street: ['', Validators.required],
        zipCode: ['', Validators.required],
        country: ['', Validators.required],
        fullAddress: [''],
        vat: [''],
        isTe: [false],
      });
      return;
    }

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
    if (this.form?.valid) {
      this.isFormSubmited.set(true);
      const newDeliveryAddress: DeliveryAddressCreate = this.form.getRawValue();

      this.dialogRef.close({ data: newDeliveryAddress });

      // this.deliveryAddressService
      //   .CreateDeliveryAddress(newDeliveryAddress)
      //   .pipe(finalize(() => this.isFormSubmited.set(false)))
      //   .subscribe({
      //     next: (address: DeliveryAddress) => {
      //       this.toastr.showSuccess('Delivery address added successfully');
      //       this.dialogRef.close(address.id);
      //       this.resetForm();
      //     },
      //     error: (error) => {
      //       this.toastr.showError('Unknown error occured');
      //     },
      //   });
    }
  }

  resetForm() {
    this.form.reset();
  }
}
