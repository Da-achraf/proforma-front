import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CURRENCY_CODES } from '../../../models/request.model';

@Component({
  selector: 'app-add-historical-data',
  templateUrl: './add-historical-data.component.html',
  styleUrl: './add-historical-data.component.css',
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
    console.log('data: ', this.form.getRawValue());

    const body = {
      ...this.form.getRawValue(),
      coo: this.form.get('coo')?.value.alpha2Code,
    };

    this.dialogRef.close({ data: body });
  }
}
