// import { Component, inject } from '@angular/core';
// import { MatDialogRef } from '@angular/material/dialog';
// import { BulkUploadResult } from '../../../models/historical-data.model';
// import { HistoricalDataBulkUploadStore } from './bulk-upload.store';
// import { TemplateService } from './import-template.service';

// @Component({
//   selector: 'app-hd-bulk-upload',
//   templateUrl: 'bulk-upload.component.html',
//   styleUrl: 'bulk-upload.component.css',
// })
// export class BulkUploadComponent {
//   protected readonly dialogRef = inject(MatDialogRef<BulkUploadComponent>);
//   private readonly templateService = inject(TemplateService);
//   protected readonly bulkUploadStore = inject(HistoricalDataBulkUploadStore);

//   private file!: File | null;

//   uploadProgress?: number;
//   uploadResult?: BulkUploadResult;

//   onFileSelected(event: Event) {
//     const input = event.target as HTMLInputElement;
//     const file = input.files?.[0];
//     if (file) {
//       this.file = file;
//     }
//   }

//   downloadTemplate(): void {
//     this.templateService.generateHistoricalDataTemplate();
//   }

//   upload() {
//     const file = this.file;
//     if (file) {
//       console.log('file: ', file);
//       this.bulkUploadStore.bulkUpload(file);
//       this.dialogRef.close();
//     }
//   }
// }

import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef } from '@angular/material/dialog';
import { HistoricalDataBulkUploadStore } from './bulk-upload.store';
import { TemplateService } from './import-template.service';

@Component({
  selector: 'app-hd-bulk-upload',
  templateUrl: 'bulk-upload.component.html',
  styleUrl: 'bulk-upload.component.css',
})
export class BulkUploadComponent {
  private readonly templateService = inject(TemplateService);

  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly bulkUploadStore = inject(HistoricalDataBulkUploadStore);

  allowedExtensions = ['.xlsx', '.csv'];
  file: File | null = null;
  validationErrors: string[] = [];
  isValidFile = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.validateFile(file);
    }
  }

  validateFile(file: File) {
    this.validationErrors = [];

    // File type validation
    if (!this.allowedExtensions.some((ext) => file.name.endsWith(ext))) {
      this.validationErrors.push(
        'Invalid file type. Please upload .xlsx or .csv files.'
      );
    }

    // File size validation (50MB)
    if (file.size > 50 * 1024 * 1024) {
      this.validationErrors.push('File size exceeds 50MB limit.');
    }

    this.isValidFile = this.validationErrors.length === 0;
    this.file = this.isValidFile ? file : null;
  }

  upload() {
    if (this.file && this.isValidFile) {
      this.bulkUploadStore.bulkUpload(this.file);
    }
  }

  downloadTemplate(): void {
    this.templateService.generateHistoricalDataTemplate();
  }
}
