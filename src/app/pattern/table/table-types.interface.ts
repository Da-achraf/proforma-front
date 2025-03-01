interface ColumnFilter {
  type: 'date' | 'text' | 'numeric' | 'boolean'; // add other filter types as needed
  field: string;
}

export interface TableColumn {
  header: string;
  field: string;
  sortable?: boolean;
  sortField?: string;
  filter?: ColumnFilter;
  type?: 'date' | 'text' | 'custom' | 'boolean' | 'numeric'; // add other column types as needed
  template?: string;

  filterTemplate?: string | undefined;
}
