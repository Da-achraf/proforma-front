import {
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  NgClass,
  NgOptimizedImage,
} from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import {
  createdAtFormat,
  InvoiceTypeEnum,
  RequestModel,
  StandardFieldEnum,
} from '../../../models/request.model';
import { getFieldValue, getWeight } from '../../helpers/invoice.helper';
import { CountryPipe } from '../../pipes/country.pipe';
import { DeliveryAddressPipe } from '../../pipes/delivery-address.pipe';
import { ItemAmountPipe } from '../../pipes/item-amount.pipe';
import { TotalAmountPipe } from '../../pipes/total-amount.pipe';

@Component({
  selector: 'app-the-invoice',
  templateUrl: './the-invoice.component.html',
  styleUrl: './the-invoice.component.css',
  imports: [
    NgClass,
    DatePipe,
    DecimalPipe,
    CurrencyPipe,
    NgOptimizedImage,
    DeliveryAddressPipe,
    CountryPipe,
    TotalAmountPipe,
    ItemAmountPipe,
  ],
})
export class TheInvoiceComponent {
  borderStyle = 'border-[2px] border-gray-600 rounded-sm';
  StandardFieldEnum = StandardFieldEnum;

  invoiceDate = new Date();

  InvoiceTypeEnum = InvoiceTypeEnum;

  request = input.required<RequestModel | undefined>();

  createdAtFormat = signal(createdAtFormat);

  itemsWithValues = computed(() => {
    const request = this.request();
    return request?.itemsWithValues ?? [];
  });

  values = computed(() => {
    const itemsWithValues: any[] = this.itemsWithValues() ?? [];
    return itemsWithValues?.map((i: any) => i.values);
  });

  netWeight = computed<number>(() => {
    return this.itemsWithValues().reduce((total: any, item: any) => {
      const netWeightValue = item.values.find(
        (v: any) => v.name === 'Net Weight',
      )?.value;
      return total + (netWeightValue ? parseFloat(netWeightValue) : 0);
    }, 0);
  });

  // Methods
  getFieldValue = getFieldValue;
  getWeight = getWeight;
}
