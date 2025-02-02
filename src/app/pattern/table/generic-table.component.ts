import {
  Component,
  computed,
  contentChildren,
  input,
  OnInit,
  output,
  TemplateRef
} from '@angular/core';
import { Table } from 'primeng/table';
import { TableColumn } from './table-types.interface';

@Component({
  selector: 'ba-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
})
export class GenericTableComponent implements OnInit {
  templates = contentChildren<TemplateRef<any>>(TemplateRef);

  page = output<number>();
  pageSize = output<number>();

  create = output<void>();
  edit = output<number>();
  view = output<number>();
  delete = output<number>();
  review = output<number>();

  readonly data = input<any[]>([]);
  readonly total = input.required<number>();
  readonly columns = input<TableColumn[]>([]);
  readonly globalFilterFields = input<string[]>([]);
  readonly pageSizeOptions = input([25, 50, 100, 200]);
  readonly loading = input(true);

  readonly withCreate = input(true);
  readonly withEdit = input(true);
  readonly withDelete = input(true);
  readonly withViewDetail = input(false);
  readonly withReview = input(false);

  columnsLength = computed(() => this.columns().length);

  private readonly size = 25;

  ngOnInit(): void {
    this.page.emit(1);
    this.pageSize.emit(this.size);
  }

  getTableDataTemplate(column: any): TemplateRef<any> | null {
    const template = this.templates().find(
      (t: any) => t['_declarationTContainer'].localNames[0] === column.template
    );
    return template || null;
  }

  getFilterTemplate(column: any): TemplateRef<any> | null {
    const template = this.templates().find(
      (t: any) => t['_declarationTContainer'].localNames[0] === column.filterTemplate
    );
    return template || null;
  }

  clear(table: Table) {
    table.clear();
  }

  onFilter(event: any) {
    console.log('Filter: ', event);
  }
}
