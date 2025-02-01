import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { ShipPointModel } from '../../../models/ship.model';
import { ShippointService } from '../../../services/shippoint.service';
import { ToasterService } from '../../../shared/services/toaster.service';

@Component({
  selector: 'app-shippoint-crud',
  templateUrl: './shippoint-crud.component.html',
  styleUrl: './shippoint-crud.component.css',
})
export class ShippointCrudComponent implements OnInit {
  // Injected dependencies
  private fb = inject(FormBuilder);
  private shipointService = inject(ShippointService);
  private dialogRef = inject(MatDialogRef<ShippointCrudComponent>);
  private toastr = inject(ToasterService);
  private data = signal(inject(MAT_DIALOG_DATA));

  // Component properties
  shipPointForm!: FormGroup;

  // Component signals and computed values
  isFormSubmited = signal(false);
  isUpdateMode = computed(() => this.data()?.isUpdateMode);
  shipPoint = computed<ShipPointModel | undefined>(
    () => this.data()?.shipPoint
  );

  formHeaderText = computed(() => {
    return this.isUpdateMode()
      ? 'Update a ship point'
      : 'Register a new ship point';
  });

  shipPointEffect = effect(() => {
    const shipPoint = this.shipPoint();
    if (!shipPoint) return;

    untracked(() => this.patchShipPointFormValue(shipPoint));
  });


  // Component hooks
  ngOnInit(): void {
    this.initializeForm();
  }

  // Component methods
  private initializeForm() {
    this.shipPointForm = this.fb.group({
      shipPoint: ['', Validators.required],
      fullAddress: ['', Validators.required],
      isTe: [true],
    });
  }

  patchShipPointFormValue(shipPoint: ShipPointModel) {
    this.shipPointForm.patchValue(shipPoint);
  }

  createShipPoint() {
    if (this.shipPointForm.valid) {
      this.isFormSubmited.set(true);
      const newShipPoint: ShipPointModel = {
        id_ship: 0,
        shipPoint: this.shipPointForm.value.shipPoint,
        fullAddress: this.shipPointForm.value.fullAddress,
        isTe: this.shipPointForm.value.isTe,
      };

      this.shipointService
        .CreateShipPoint(newShipPoint)
        .pipe(finalize(() => this.isFormSubmited.set(false)))
        .subscribe({
          next: (shipPoint: ShipPointModel) => {
            console.log('Ship point added successfully: ', shipPoint);
            this.toastr.showSuccess('Ship point added successfully');
            this.dialogRef.close(shipPoint.id_ship);
            this.resetShipointForm();
          },
          error: (error) => {
            this.toastr.showError('Unknown error occured');
          },
        });
    }
  }

  resetShipointForm() {
    this.shipPointForm.reset();
  }
}
