import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { FileExtensionPipe } from '../../../../ui/pipes/file-extension.pipe';
import { FileSizePipe } from '../../../../ui/pipes/file-size.pipe';
import { BulkUploadFeedbackComponent } from '../../../../ui/components/bulk-upload-feedback/bulk-upload-feedback.component';
import { HistoricalDataBulkUploadStore } from '../hd-bulk-upload.store';
import { HDFileValidationService } from '../hd-file-validation.service';
import { HDTemplateService } from '../hd-import-template.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-hd-bulk-upload',
  templateUrl: 'hd-bulk-upload.component.html',
  styleUrl: 'hd-bulk-upload.component.css',
  imports: [
    MatIcon,
    FileExtensionPipe,
    FileSizePipe,
    MatProgressBar,
    MatButtonModule,
    BulkUploadFeedbackComponent,
  ],
})
export class HDBulkUploadComponent { // Historical Data Bulk Upload
  private readonly HDTemplateService = inject(HDTemplateService);

  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly bulkUploadStore = inject(HistoricalDataBulkUploadStore);
  protected readonly fileValidator = inject(HDFileValidationService);

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
    this.HDTemplateService.generateHistoricalDataTemplate();
  }
}
