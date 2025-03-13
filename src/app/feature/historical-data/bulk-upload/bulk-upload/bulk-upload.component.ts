import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { FileExtensionPipe } from '../../../../ui/pipes/file-extension.pipe';
import { FileSizePipe } from '../../../../ui/pipes/file-size.pipe';
import { BulkUploadFeedbackComponent } from '../bulk-upload-feedback/bulk-upload-feedback.component';
import { HistoricalDataBulkUploadStore } from '../bulk-upload.store';
import { FileValidationService } from '../file-validation.service';
import { TemplateService } from '../import-template.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-hd-bulk-upload',
  templateUrl: 'bulk-upload.component.html',
  styleUrl: 'bulk-upload.component.css',
  imports: [
    MatIcon,
    FileExtensionPipe,
    FileSizePipe,
    MatProgressBar,
    MatButtonModule,
    BulkUploadFeedbackComponent,
  ],
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
