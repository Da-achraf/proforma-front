import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, computed, inject, model, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FieldTypeEnum,
  fieldTypes,
  ItemField,
  ItemModel,
  RequestItemModel,
  standardFields,
} from '../../core/models/request-item.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-create-item-dialog',
  templateUrl: './create-item-dialog.component.html',
  styleUrl: './create-item-dialog.component.css',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInput, MatSelectModule],
})
export class CreateItemDialogComponent {
  dialogRef = inject(MatDialogRef<CreateItemDialogComponent>);
  data: ItemModel = inject(MAT_DIALOG_DATA);
  readonly announcer = inject(LiveAnnouncer);
  fb = inject(FormBuilder);

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  fieldTypes = fieldTypes;

  label = model('');
  readonly currentFieldName = signal<string>('');
  readonly fields = signal<ItemField[]>(standardFields);
  readonly allFields = signal<ItemField[]>([
    ...standardFields,
    {
      name: 'PN',
      type: FieldTypeEnum.TEXT,
    },
  ]);

  readonly filteredFields = computed(() => {
    const currentField = this.currentFieldName()?.toLowerCase();
    const allFields = this.allFields();
    return currentField
      ? allFields.filter((field) =>
          field.name.toLowerCase()?.includes(currentField),
        )
      : allFields.slice();
  });

  fieldFormVisible = signal(false);

  fieldForm = this.fb.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveItem(): void {
    const itemToSave: RequestItemModel = {
      nameItem: this.fieldForm.value.name as string,
      type: this.fieldForm.value.type as FieldTypeEnum,
      isMandatory: false,
    };
    this.dialogRef.close(itemToSave);
  }

  toggleFieldForm() {
    this.fieldFormVisible.update((v) => !v);
  }

  add(): void {
    const value = this.fieldForm.value;
    const newField: ItemField = {
      name: value.name as string,
      type: value.type as FieldTypeEnum,
    };
    console.log(value);
    if (value.name && value.type) {
      this.fields.update((fields) => [...fields, newField]);
    }

    // Clear the input value and reset the form
    this.currentFieldName.set('');
    this.fieldForm.reset();
  }

  remove(field: string): void {
    this.fields.update((fields) => {
      const index = fields.map((f) => f.name).indexOf(field);
      if (index < 0) {
        return fields;
      }

      fields.splice(index, 1);
      this.announcer.announce(`Removed ${field}`);
      return [...fields];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedField: ItemField = event.option.value as ItemField;
    if (selectedField) {
      this.fields.update((fields) => {
        if (
          !fields
            .map((f) => f.name.toLowerCase())
            .includes(selectedField.name.toLowerCase() as string)
        ) {
          return [...fields, selectedField];
        }
        return fields;
      });
      this.currentFieldName.set('');
      this.fieldForm.patchValue({ name: '', type: '' });
    }
  }

  updateCurrentFieldName(value: string): void {
    this.currentFieldName.set(value);
  }
}
