import { TableColumn } from '../../../pattern/table/table-types.interface';

export const COLUMNS: TableColumn[] = [
  {
    header: 'Customer Id',
    field: 'customerId',
    filter: { type: 'text', field: 'customerId' },
    type: 'text',
  },
  {
    header: 'Company Name',
    field: 'companyName',
    filter: { type: 'text', field: 'companyName' },
    type: 'numeric',
  },
  {
    header: 'Street',
    field: 'street',
    filter: { type: 'text', field: 'street' },
    type: 'text',
  },
  {
    header: 'Zip Code',
    field: 'zipCode',
    filter: { type: 'text', field: 'zipCode' },
    type: 'text',
  },
  {
    header: 'Country',
    field: 'country',
    filter: { type: 'text', field: 'country' },
    type: 'text',
  },
  {
    header: 'VAT',
    field: 'vat',
    filter: { type: 'text', field: 'vat' },
    type: 'text',
  },
  {
    header: 'Full Address',
    field: 'fullAddress',
    filter: { type: 'text', field: 'fullAddress' },
    type: 'text',
  },
];
