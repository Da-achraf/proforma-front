import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrl: './delete-confirmation-dialog.component.css',
  imports: [MatDialogModule, MatButtonModule]
})
export class DeleteConfirmationDialogComponent {
  data = inject(MAT_DIALOG_DATA);
}
