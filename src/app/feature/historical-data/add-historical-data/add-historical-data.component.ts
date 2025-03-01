import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-historical-data',
  templateUrl: './add-historical-data.component.html',
})
export class AddHistoricalDataComponent implements OnInit {
  // Injected dependencies
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddHistoricalDataComponent>);

  // Component properties
  form!: FormGroup;

  // Component signals and computed values
  protected readonly isFormSubmited = signal(false);

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
    this.dialogRef.close({ data: this.form.getRawValue() });
  }
}
