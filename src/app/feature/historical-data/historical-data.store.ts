import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { filter, map, switchMap, tap } from 'rxjs';
import {
  BulkUploadResult,
  HistoricalData,
  HistoricalDataCreate,
  HistoricalDataUpdate,
} from '../../models/historical-data.model';
import { DeleteDialogComponent } from '../../pattern/dialogs/delete-dialog.component';
import { withPagedEntities } from '../../shared/services/with-paged-entities.store';
import { AddHistoricalDataComponent } from './add-historical-data/add-historical-data.component';
import { HistoricalDataService } from './hitorical-data.service';
import { UpdateHistoricalDataComponent } from './update-historical-data/update-historical-data.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { HttpEventType, HttpResponse } from '@angular/common/http';

type DataState = {
  uploadProgress: number;
  uploadResult: any;
};


export const HistoricalDataStore = signalStore(
  { providedIn: 'root' },

  withPagedEntities<HistoricalData, HistoricalDataCreate, HistoricalDataUpdate>(
    HistoricalDataService
  ),

  withProps(() => ({
    dialog: inject(MatDialog),
    destroyRef: inject(DestroyRef),
    dataService: inject(HistoricalDataService),
  })),

  withMethods(
    ({
      entityMap,
      save,
      dialog,
      update,
      deleteOne,
      destroyRef,
      dataService,
      ...store
    }) => ({
      openCreateDataDialog: () => {
        const dialogRef = dialog.open(AddHistoricalDataComponent, {
          width: '800px',
        });

        dialogRef
          .afterClosed()
          .pipe(
            filter((result) => !!result?.data),
            map((result) => result.data)
          )
          .subscribe((result: HistoricalDataCreate) => {
            save(result);
          });
      },

      openEditDataDialog: (id: number) => {
        const historicalData = entityMap()[id];

        const dialogRef = dialog.open(UpdateHistoricalDataComponent, {
          width: '800px',
          data: { historicalData },
        });

        dialogRef
          .afterClosed()
          .pipe(filter((result) => !!result?.data))
          .subscribe((result) => {
            console.log('update data:', result);
            update({ body: historicalData, id: historicalData.id });
          });
      },

      openDeleteDataDialog: (id: number) => {
        dialog
          .open(DeleteDialogComponent, {
            data: { label: 'data' },
            minWidth: '40vw',
            maxHeight: '95vh',
          })
          .afterClosed()
          .pipe(takeUntilDestroyed(destroyRef))
          .subscribe({
            next: (res) => {
              if (res && res?.type === 'delete') deleteOne(id);
            },
          });
      },

      openUploadDataDialog: () => {
        const dialogRef = dialog.open(BulkUploadComponent, {
          width: '800px',
        });

        dialogRef.afterClosed().subscribe((file) => {
          console.log('file: ', file);

          // dataService
          //   .uploadExcel(file)
          //   .pipe(
          //     tap((event) => {
          //       if (event.type === HttpEventType.UploadProgress) {
          //         const progress = Math.round(
          //           (event.loaded / (event.total || 1)) * 100
          //         );
          //         patchState(store, { uploadProgress: progress });
          //       }
          //     }),
          //     filter((event) => event.type === HttpEventType.Response),
          //     map((event) => (event as HttpResponse<BulkUploadResult>).body!)
          //   )
          //   .subscribe((result) => {
          //     patchState(store, { uploadResult: result });
          //   });
        });
      },
    })
  )
);
