import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-item-dialog',
  templateUrl: './create-item-dialog.component.html',
  styleUrl: './create-item-dialog.component.css'
})
export class CreateItemDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { label: string },
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveItem(): void {
    this.dialogRef.close(this.data)
  }
}
