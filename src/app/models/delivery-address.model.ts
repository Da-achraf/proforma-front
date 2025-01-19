import { Column, TableProperty } from './table.model';

type DeliveryAddressBase = {
  customerId?: string;
  companyName?: string;
  street?: string;
  zipCode?: string;
  country?: string;
  vat?: string;
  fullAddress?: string;
  isTe: boolean;
};

export type DeliveryAddressCreate = DeliveryAddressBase;
export type DeliveryAddressUpdate = DeliveryAddressBase;
export type DeliveryAddress = DeliveryAddressBase & {
  id: number;
};

export const emptyDeliveryAddress: DeliveryAddress = {
  id: 0,
  customerId: '',
  companyName: '',
  street: '',
  zipCode: '',
  country: '',
  fullAddress: '',
  vat: '',
  isTe: false,
};

export const deliveryAddressTableProperties: TableProperty[] = [
  {
    name: 'id',
    isDisplayed: false,
  },
  {
    name: 'customerId',
    isDisplayed: true,
  },
  {
    name: 'companyName',
    isDisplayed: true,
  },
  {
    name: 'street',
    isDisplayed: true,
  },
  {
    name: 'zipCode',
    isDisplayed: true,
  },
  {
    name: 'country',
    isDisplayed: true,
  },
  {
    name: 'fullAddress',
    isDisplayed: true,
  },
];

export const deliveryAddressTableColumns: Column[] = [
  {
    label: 'Customer Id',
    isSortable: false,
  },
  {
    label: 'Company Name',
    isSortable: false,
  },
  {
    label: 'Street',
    isSortable: false,
  },
  {
    label: 'Zip Code',
    isSortable: false,
  },
  {
    label: 'Country',
    isSortable: false,
  },
  {
    label: 'Full Address',
    isSortable: false,
  },
  {
    label: 'Actions',
    isSortable: false,
  },
];
