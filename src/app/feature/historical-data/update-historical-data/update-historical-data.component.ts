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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { HistoricalData } from '../../../core/models/historical-data.model';
import { CountrySelectorComponent } from '../../../ui/components/country-select/country-select.component';

@Component({
  selector: 'app-update-historical-data',
  templateUrl: './update-historical-data.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    CountrySelectorComponent,
    MatButtonModule,
  ],
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
    () => this.data()?.historicalData,
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
      coo: ['', Validators.required],
    });
  }

  patchFormValue(data: HistoricalData) {
    this.form.patchValue(data);
  }

  resetForm() {
    this.form.reset();
  }

  saveChanges() {
    const body = this.form.getRawValue();
    this.dialogRef.close({ data: body });
  }
}
