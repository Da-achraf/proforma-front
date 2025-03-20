import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { signalStore, withMethods, withProps } from '@ngrx/signals';
import { filter, map } from 'rxjs';
import {
  HistoricalData,
  HistoricalDataCreate,
  HistoricalDataUpdate,
} from '../../core/models/historical-data.model';
import { DeleteDialogComponent } from '../../pattern/dialogs/delete-dialog.component';
import { withPagedEntities } from '../../shared/services/with-paged-entities.store';
import { AddHistoricalDataComponent } from './add-historical-data/add-historical-data.component';
import { HDBulkUploadComponent } from './bulk-upload/hd-bulk-upload/hd-bulk-upload.component';
import { HistoricalDataService } from './hitorical-data.service';
import { UpdateHistoricalDataComponent } from './update-historical-data/update-historical-data.component';

export const HistoricalDataStore = signalStore(
  { providedIn: 'root' },

  withPagedEntities<HistoricalData, HistoricalDataCreate, HistoricalDataUpdate>(
    HistoricalDataService,
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
          width: '900px',
        });

        dialogRef
          .afterClosed()
          .pipe(
            filter((result) => !!result?.data),
            map((result) => result.data),
          )
          .subscribe((result: HistoricalDataCreate) => {
            save(result);
          });
      },

      openEditDataDialog: (id: number) => {
        const historicalData = entityMap()[id];

        const dialogRef = dialog.open(UpdateHistoricalDataComponent, {
          width: '900px',
          data: { historicalData },
        });

        dialogRef
          .afterClosed()
          .pipe(
            filter((result) => !!result?.data),
            map((result) => result?.data),
          )
          .subscribe((result) => {
            update({ body: result, id: historicalData.id });
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
        const dialogRef = dialog.open(HDBulkUploadComponent, {
          width: '900px',
        });

        dialogRef.afterClosed().subscribe((file) => {
          console.log('file: ', file);
        });
      },
    }),
  ),
);
