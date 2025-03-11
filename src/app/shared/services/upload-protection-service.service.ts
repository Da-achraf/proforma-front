import { effect, inject, Injectable, untracked } from '@angular/core';
import { HistoricalDataBulkUploadStore } from '../../feature/historical-data/bulk-upload/bulk-upload.store';

@Injectable({ providedIn: 'root' })
export class UploadProtectionService {
  protected readonly bulkUploadStore = inject(HistoricalDataBulkUploadStore);

  private beforeUnloadHandler: ((event: BeforeUnloadEvent) => void) | null =
    null;


  private readonly bulkUploadingEffect = effect(() => {
    const isUploading = this.bulkUploadStore.isUploading();

    untracked(() => {
      if (isUploading) {
        this.addBeforeUnloadListener();
      } else {
        this.removeBeforeUnloadListener();
      }
    });
  });

  public addBeforeUnloadListener(): void {
    if (this.beforeUnloadHandler) return; // Avoid adding multiple listeners

    this.beforeUnloadHandler = (event: BeforeUnloadEvent) => {
      if (this.bulkUploadStore.isUploading()) {
        event.preventDefault();
        event.returnValue =
          'You have an ongoing upload. Are you sure you want to leave?';
        return event.returnValue;
      }
    };

    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  }

  public removeBeforeUnloadListener(): void {
    if (this.beforeUnloadHandler) {
      window.removeEventListener('beforeunload', this.beforeUnloadHandler);
      this.beforeUnloadHandler = null;
    }
  }
}
