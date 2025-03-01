import { TableColumn } from '../../../pattern/table/table-types.interface';

export const COLUMNS: TableColumn[] = [
  {
    header: 'Material',
    field: 'material',
    filter: { type: 'text', field: 'material' },
    type: 'text',
  },
  {
    header: 'Unit Value',
    field: 'unitValue',
    sortField: 'unitValue',
    filter: { type: 'numeric', field: 'unitValue' },
    type: 'numeric',
  },
  {
    header: 'Description',
    field: 'description',
    filter: { type: 'text', field: 'description' },
    type: 'text',
  },
  {
    header: 'HTS Code',
    field: 'htsCode',
    filter: { type: 'text', field: 'htsCode' },
    type: 'text',
  },
  {
    header: 'COO',
    field: 'coo',
    filter: { type: 'text', field: 'coo' },
    type: 'text',
  },
];
