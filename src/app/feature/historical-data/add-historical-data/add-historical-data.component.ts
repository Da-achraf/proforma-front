import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CURRENCY_CODES } from '../../../core/models/request.model';
import { CountrySelectorComponent } from '../../../ui/components/country-select/country-select.component';

@Component({
  selector: 'app-add-historical-data',
  templateUrl: './add-historical-data.component.html',
  styleUrl: './add-historical-data.component.css',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    CountrySelectorComponent,
    MatButtonModule,
  ],
})
export class AddHistoricalDataComponent implements OnInit {
  // Injected dependencies
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddHistoricalDataComponent>);

  // Component properties
  form!: FormGroup;

  // Component signals and computed values
  protected readonly isFormSubmited = signal(false);
  currencyCodes = signal<string[]>(CURRENCY_CODES);

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

  resetForm() {
    this.form.reset();
  }

  createData() {
    const body = this.form.getRawValue();
    this.dialogRef.close({ data: body });
  }
}
