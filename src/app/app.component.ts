import { Component, effect, inject, OnDestroy, untracked } from '@angular/core';
import { tap } from 'rxjs';
import { HistoricalDataBulkUploadStore } from './feature/historical-data/bulk-upload/hd-bulk-upload.store';
import { UserService } from './services/user.service';
import { SideNavService } from './shared/services/side-nav.service';
import { UploadProtectionService } from './shared/services/upload-protection-service.service';
import { ToastComponent } from './pattern/toast/toast.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [ToastComponent, RouterOutlet],
})
export class AppComponent implements OnDestroy {
  private readonly userService = inject(UserService);
  private readonly sideNavService = inject(SideNavService);
  protected readonly bulkUploadStore = inject(HistoricalDataBulkUploadStore);
  protected readonly uploadProtectionService = inject(UploadProtectionService);

  constructor() {
    this.userService
      .getUsers()
      .pipe(tap(this.sideNavService.users.set))
      .subscribe();
  }

  /**
   * This effect is to prevent the user from reloading the browser
   * or to close the app tab when the bulk uploading is going on.
   * When the user confirms that he wants the quit, the upload is aborted.
   */
  private readonly bulkUploadingEffect = effect(() => {
    const isUploading = this.bulkUploadStore.isUploading();

    untracked(() => {
      if (isUploading) {
        this.uploadProtectionService.addBeforeUnloadListener();
      } else {
        this.uploadProtectionService.removeBeforeUnloadListener();
      }
    });
  });

  ngOnDestroy(): void {
    // Clean up the event listener when the component is destroyed
    this.uploadProtectionService.removeBeforeUnloadListener();
  }
}
