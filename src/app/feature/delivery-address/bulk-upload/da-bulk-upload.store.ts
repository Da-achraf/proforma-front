import { computed, DestroyRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { catchError, of, Subscription, tap } from 'rxjs';
import { BulkUploadSignalR1Service } from '../../../core/bulk-upload/bulk-upload-progress1.service';
import { BulkUploadResult } from '../../../core/models/historical-data.model';
import { AuthService } from '../../../services/auth.service';
import { DeliveryAddressService } from '../../../core/delivery-address/delivery-address.service';
import { DABulkUploadComponent } from './da-bulk-upload/da-bulk-upload.component';

// Delivery Address bulk upload state
type DABulkUploadState = {
  file: File | null;
  isUploading: boolean;
  isProcessing: boolean;
  progress: number;
  preValidationErrors: string[];
  result: BulkUploadResult | null;
  error: Error | null;
  subscription: Subscription | null;
};

const initialState: DABulkUploadState = {
  file: null,
  isUploading: false,
  isProcessing: false,
  progress: 0,
  preValidationErrors: [],
  result: null,
  error: null,
  subscription: null,
};

export const DeliveryAddressBulkUploadStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withProps(() => ({
    dialog: inject(MatDialog),
    destroyRef: inject(DestroyRef),
    deliveryAddressService: inject(DeliveryAddressService),
    signalRService: inject(BulkUploadSignalR1Service),
    authService: inject(AuthService),
  })),

  withComputed(({ preValidationErrors, file }) => ({
    isFileValid: computed(() => file() && preValidationErrors().length === 0),
  })),

  withMethods(({ signalRService, ...store }) => ({
    async registerUpload(): Promise<string> {
      await signalRService.startConnection();

      const uploadId = signalRService.generateUploadId();
      await signalRService.registerUpload(uploadId); // Register the upload with the backend

      return Promise.resolve(uploadId);
    },
  })),

  withMethods(
    ({
      deliveryAddressService,
      isUploading,
      file,
      progress,
      registerUpload,
      result,
      error,
      subscription,
      signalRService,
      authService,
      ...store
    }) => ({
      setFile: (file: File | null) => {
        patchState(store, { file });
      },

      bulkUpload: async () => {
        const _file = file();

        if (isUploading() || !_file) return;

        // Register the upload with the backend
        // and get the upload id
        const uploadId = await registerUpload();

        // Listen for progress updates for this upload
        signalRService.getProgressUpdates(uploadId).subscribe((progress) => {
          patchState(store, { progress, isProcessing: progress < 100 });
        });

        patchState(store, {
          isUploading: true,
          isProcessing: false,
          progress: 0,
          error: null,
          result: null,
        });

        const upload$ = deliveryAddressService
          .uploadExcel(_file, uploadId)
          .pipe(
            tap((result) => {
              patchState(store, {
                result,
                isUploading: false,
                isProcessing: false,
                progress: 100, // Ensure progress is set to 100% on completion
              });
            }),
            catchError((error) => {
              patchState(store, {
                error,
                isUploading: false,
                isProcessing: false,
                progress: 0, // Reset progress on error
              });
              return of(null);
            }),
          );

        // Store the subscription
        const subscription = upload$.subscribe();
        patchState(store, { subscription });
      },

      abortUpload: () => {
        const sub = subscription();
        if (sub) {
          sub.unsubscribe();
          patchState(store, {
            isUploading: false,
            isProcessing: false,
            progress: 0,
            error: new Error('Upload aborted by user'),
            subscription: null,
          });
        }
      },

      resetState: () => {
        patchState(store, {
          file: null,
          isUploading: false,
          isProcessing: false,
          progress: 0,
          result: null,
          error: null,
          preValidationErrors: [],
        });
      },

      setPreValidationErrors: (preValidationErrors: string[]) => {
        patchState(store, { preValidationErrors });
      },
    }),
  ),

  withMethods(({ dialog }) => ({
    openUploadDataDialog: () => {
      const dialogRef = dialog.open(DABulkUploadComponent, {
        width: '60vw',
        maxHeight: '95vh',
        maxWidth: '1200px',
      });

      dialogRef.afterClosed().subscribe(() => {
        console.log('uploading....');
      });
    },
  })),
);
