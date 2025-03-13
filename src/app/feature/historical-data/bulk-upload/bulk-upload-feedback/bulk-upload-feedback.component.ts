import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTable, MatTableModule } from '@angular/material/table';
import {
  BulkUploadError,
  BulkUploadResult,
} from '../../../../models/historical-data.model';

@Component({
  selector: 'app-bulk-upload-feedback',
  templateUrl: './bulk-upload-feedback.component.html',
  styles: [
    `
      table {
        @apply w-full border-collapse border border-gray-300;
      }
      th {
        @apply border border-gray-300 bg-gray-100 p-2 text-left;
      }
      td {
        @apply border border-gray-300 p-2;
      }
    `,
  ],
  imports: [
    DecimalPipe,
    MatTable,
    MatPaginator,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
  ],
})
export class BulkUploadFeedbackComponent {
  result = input<BulkUploadResult | null>();
  pageSize = 10; // Errors per page
  currentPage = 0;

  get paginatedErrors(): BulkUploadError[] {
    const result = this.result();
    if (!result) return [];
    const start = this.currentPage * this.pageSize;
    return result.errors.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  downloadErrors() {
    const result = this.result();
    if (!result) return;
    const blob = new Blob([JSON.stringify(result.errors, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'upload_errors.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  viewErrorsAsJSON() {
    const result = this.result();
    if (!result) return;

    const jsonString = JSON.stringify(result.errors, null, 2);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`<pre>${jsonString}</pre>`);
      newWindow.document.title = 'Bulk Upload Errors';
    }
  }
}
