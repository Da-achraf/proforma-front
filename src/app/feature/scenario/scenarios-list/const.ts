import { TableColumn } from "../../../pattern/table/table-types.interface";

export const COLUMNS: TableColumn[] = [
    {
      header: 'Scenario Label',
      field: 'name',
      sortable: true,
      sortField: 'name',
      filter: { type: 'text', field: 'name' },
      type: 'text',
    },
    {
      header: 'Fields Count',
      field: '',
      type: 'custom',
      sortable: false,
      template: 'fieldsCountTemplate',
    },
    {
      header: 'Status',
      field: '',
      type: 'custom',
      sortable: false,
      template: 'scenarioStatusTemplate',
    }
  ];

export const GLOBAL_FILTER_FIELDS = [
  'name',
];
