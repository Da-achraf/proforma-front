import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { BulkUploadFeedbackComponent } from '../../../../ui/components/bulk-upload-feedback/bulk-upload-feedback.component';
import { FileExtensionPipe } from '../../../../ui/pipes/file-extension.pipe';
import { FileSizePipe } from '../../../../ui/pipes/file-size.pipe';
import { DATemplateService } from '../da-import-template.service';
import { DAFileValidationService } from '../da-file-validation.service';
import { DeliveryAddressBulkUploadStore } from '../da-bulk-upload.store';

@Component({
  selector: 'app-da-bulk-upload',
  templateUrl: 'da-bulk-upload.component.html',
  styleUrl: 'da-bulk-upload.component.css',
  imports: [
    MatIcon,
    FileExtensionPipe,
    FileSizePipe,
    MatProgressBar,
    MatButtonModule,
    BulkUploadFeedbackComponent,
  ],
})
export class DABulkUploadComponent {
  // DeliveryAddressBulkUploadComponent
  private readonly daTemplateService = inject(DATemplateService);

  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly bulkUploadStore = inject(DeliveryAddressBulkUploadStore);
  protected readonly fileValidator = inject(DAFileValidationService);

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
    this.daTemplateService.generateHistoricalDataTemplate();
  }
}
