import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, map, pipe, switchMap } from 'rxjs';
import { DeliveryAddressCrudComponent } from './delivery-address-crud/delivery-address-crud.component';
import { DeleteDialogComponent } from '../../pattern/dialogs/delete-dialog.component';
import { withPagedEntities } from '../../shared/services/with-paged-entities.store';
import {
  DeliveryAddress,
  DeliveryAddressCreate,
  DeliveryAddressUpdate,
} from '../../core/models/delivery-address.model';
import { DeliveryAddressService } from '../../core/delivery-address/delivery-address.service';
import { DABulkUploadComponent } from './bulk-upload/da-bulk-upload/da-bulk-upload.component';

const initialState = {
  allEntities: [] as DeliveryAddress[],
};

export const DeliveryAddressStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withPagedEntities<
    DeliveryAddress,
    DeliveryAddressCreate,
    DeliveryAddressUpdate
  >(DeliveryAddressService),

  withProps(() => ({
    deliveryAddressService: inject(DeliveryAddressService),
    dialog: inject(MatDialog),
    destroyRef: inject(DestroyRef),
  })),

  // Dialogs methods
  withMethods(({ entityMap, destroyRef, save, update, deleteOne, dialog }) => ({
    openCreateDialog() {
      const dialogRef = dialog.open(DeliveryAddressCrudComponent, {
        width: '900px',
        data: {
          isUpdateMode: false,
        },
      });

      dialogRef
        .afterClosed()
        .pipe(
          filter((result) => !!result?.data),
          map((result) => result.data),
        )
        .subscribe((body: DeliveryAddressCreate) => {
          save(body);
        });
    },

    openEditDialog(id: number) {
      const deliveryAddress = entityMap()[id];

      const dialogRef = dialog.open(DeliveryAddressCrudComponent, {
        width: '900px',
        data: {
          isUpdateMode: true,
          deliveryAddress,
        },
      });

      dialogRef
        .afterClosed()
        .pipe(
          filter((result) => !!result?.data),
          map((result) => result?.data),
        )
        .subscribe((result) => {
          update({ body: result, id: deliveryAddress.id });
        });
    },

    openDeleteDialog(id: number) {
      dialog
        .open(DeleteDialogComponent, {
          data: { label: 'delivery address' },
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
  })),

  withMethods(
    ({
      entityMap,
      destroyRef,
      save,
      update,
      deleteOne,
      deliveryAddressService,
      dialog,
      ...store
    }) => ({
      // openUploadDataDialog: () => {
      //   const dialogRef = dialog.open(DABulkUploadComponent, {
      //     width: '900px',
      //   });
      //   dialogRef.afterClosed().subscribe((file) => {
      //     console.log('file: ', file);
      //   });
      // },

      // loadAll: rxMethod<void>(
      //   pipe(
      //     switchMap(() =>
      //       deliveryAddressService.load(0, 0, { RetrieveAll: true }).pipe(
      //         tapResponse({
      //           next: (response) =>
      //             patchState(store, { allEntities: response.items }),

      //           error: (err) =>
      //             console.error(
      //               'Error retrieving all dilvery addresses: ',
      //               err,
      //             ),
      //         }),
      //       ),
      //     ),
      //   ),
      // ),
    }),
  ),
);
