import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HistoricalDataBulkUploadStore } from '../bulk-upload.store';
import { FileValidationService } from '../file-validation.service';
import { TemplateService } from '../import-template.service';

@Component({
  selector: 'app-hd-bulk-upload',
  templateUrl: 'bulk-upload.component.html',
  styleUrl: 'bulk-upload.component.css',
})
export class BulkUploadComponent {
  private readonly templateService = inject(TemplateService);

  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly bulkUploadStore = inject(HistoricalDataBulkUploadStore);
  protected readonly fileValidator = inject(FileValidationService);

  async onFileSelected(event: Event) {
    this.bulkUploadStore.resetState();

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const validation = await this.fileValidator.validateFile(file);
    if (validation.valid) {
      this.bulkUploadStore.setFile(file);
    } else {
      this.bulkUploadStore.setPreValidationErrors(validation.errors);
    }
  }

  unSelectFile() {
    this.bulkUploadStore.resetState();
  }

  upload() {
    this.bulkUploadStore.bulkUpload();
  }

  downloadTemplate(): void {
    this.templateService.generateHistoricalDataTemplate();
  }
}
