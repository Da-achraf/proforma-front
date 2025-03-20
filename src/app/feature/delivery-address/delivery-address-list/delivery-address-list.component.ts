import { TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeliveryAddressStore } from '../delivery-address.store';
import { GenericTableComponent } from '../../../pattern/table/generic-table.component';
import { COLUMNS } from './const';
import { DeliveryAddressBulkUploadStore } from '../bulk-upload/da-bulk-upload.store';

@Component({
  selector: 'app-delivery-address-list',
  templateUrl: './delivery-address-list.component.html',
  styleUrl: './delivery-address-list.component.css',
  imports: [TitleCasePipe, GenericTableComponent],
})
export class DeliveryAddressListComponent {
  fb = inject(FormBuilder);
  dialog = inject(MatDialog);
  destroyRef = inject(DestroyRef);
  store = inject(DeliveryAddressStore);
  bulkUploadStore = inject(DeliveryAddressBulkUploadStore);

  columns = signal(COLUMNS).asReadonly();

  onSearch(search: string) {
    this.store.setQueryParams({ search });
  }
}
