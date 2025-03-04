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
import { HistoricalData } from '../../../models/historical-data.model';

@Component({
  selector: 'app-update-historical-data',
  templateUrl: './update-historical-data.component.html',
})
export class UpdateHistoricalDataComponent implements OnInit {
  // Injected dependencies
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UpdateHistoricalDataComponent>);

  // Component properties
  form!: FormGroup;

  // Component signals and computed values
  private readonly data = signal(inject(MAT_DIALOG_DATA));
  protected readonly isFormSubmited = signal(false);
  historicalData = computed<HistoricalData | undefined>(
    () => this.data()?.historicalData
  );

  // Component signals and computed values
  private readonly patchFormData = effect(() => {
    const historicalData = this.historicalData();
    if (!historicalData) return;

    this.patchFormValue(historicalData);
  });

  // Component hooks
  ngOnInit(): void {
    this.initializeForm();
  }

  // Component methods
  private initializeForm() {
    this.form = this.fb.group({
      material: ['', Validators.required],
      unitValue: ['', Validators.required],
      unit: ['', Validators.required],
      description: ['', Validators.required],
      htsCode: ['', Validators.required],
      alpha2Code: ['', Validators.required],
    });
  }

  patchFormValue(data: HistoricalData) {
    this.form.patchValue({
      ...data,
      alpha2Code: {
        alpha2Code: data.coo
      },
    });
  }

  resetForm() {
    this.form.reset();
  }

  saveChanges() {
    const body = {
      ...this.form.getRawValue(),
      coo: this.form.get('alpha2Code')?.value.alpa2Code,
    };

    this.dialogRef.close({ data: body });
  }
}
