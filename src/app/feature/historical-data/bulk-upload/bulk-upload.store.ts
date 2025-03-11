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
import { BulkUploadResult } from '../../../models/historical-data.model';
import { AuthService } from '../../../services/auth.service';
import { BulkUploadSignalRService } from '../bulk-upload-progress.service';
import { HistoricalDataService } from '../hitorical-data.service';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';

type HistoricalDataBulkUploadState = {
  file: File | null;
  isUploading: boolean;
  isProcessing: boolean;
  progress: number;
  preValidationErrors: string[];
  result: BulkUploadResult | null;
  error: Error | null;
  subscription: Subscription | null;
};

const initialState: HistoricalDataBulkUploadState = {
  file: null,
  isUploading: false,
  isProcessing: false,
  progress: 0,
  preValidationErrors: [],
  result: null,
  error: null,
  subscription: null,
};

export const HistoricalDataBulkUploadStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withProps(() => ({
    dialog: inject(MatDialog),
    destroyRef: inject(DestroyRef),
    dataService: inject(HistoricalDataService),
    signalRService: inject(BulkUploadSignalRService),
    authService: inject(AuthService),
  })),

  withComputed(({ preValidationErrors, file }) => ({
    isFileValid: computed(() => file() && preValidationErrors().length === 0),
  })),

  withMethods(
    ({
      dataService,
      isUploading,
      file,
      progress,
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

      bulkUpload: () => {
        const _file = file();

        if (isUploading() || !_file) return;

        signalRService.startConnection();
        signalRService.getProgressUpdates().subscribe((progress) => {
          patchState(store, {
            progress,
            isProcessing: progress < 100,
          });
        });

        patchState(store, {
          isUploading: true,
          isProcessing: false,
          progress: 0,
          error: null,
          result: null,
        });

        const upload$ = dataService
          .uploadExcel(_file, authService.getUserIdFromToken())
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
      const dialogRef = dialog.open(BulkUploadComponent, {
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
