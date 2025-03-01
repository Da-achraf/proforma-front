import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  input,
  OnInit,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { Table } from 'primeng/table';
import {
  PAGE_SIZE_OPTIONS,
  TABLE_PAGE_SIZE,
} from '../../shared/components/tables/data';
import { TableColumn } from './table-types.interface';

@Component({
  selector: 'ba-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericTableComponent implements OnInit {
  templates = contentChildren<TemplateRef<any>>(TemplateRef);

  private readonly dt1 = viewChild<Table>('dt1');

  page = output<number>();
  pageSize = output<number>();

  create = output<void>();
  edit = output<number>();
  view = output<number>();
  delete = output<number>();
  review = output<number>();
  search = output<string>();

  /**
   * the table model primary key. It's id for most of the time.
   * We provided this input to make it customizable
   */
  readonly key = input('id');

  readonly data = input<any[]>([]);
  readonly total = input.required<number>();
  readonly columns = input<TableColumn[]>([]);
  /**
   * This in order to support both search categories in the table:
   * * (emitSearch = false) => do a local search based on globalFilterFields and local data (no server side search)
   * * (emitSearch = true) => do a server side search based on emited search term
   * *
   */
  readonly emitSearch = input(false);
  readonly globalFilterFields = input<string[]>([]);

  readonly pageSizeOptions = input<number[]>(inject(PAGE_SIZE_OPTIONS));
  readonly defaultPageSize = input<number>(inject(TABLE_PAGE_SIZE));

  readonly loading = input(true);

  readonly withCreate = input(true);
  readonly withEdit = input(true);
  readonly withDelete = input(true);
  readonly withViewDetail = input(false);
  readonly withReview = input(false);

  columnsLength = computed(() => this.columns().length);

  ngOnInit(): void {
    this.page.emit(1);
    this.pageSize.emit(this.defaultPageSize());
  }

  onSearch(searchTerm: string) {
    if (this.emitSearch()) {
      this.search.emit(searchTerm);
      return;
    }
    this.dt1()?.filterGlobal(searchTerm, 'contains');
  }

  getTableDataTemplate(column: any): TemplateRef<any> | null {
    const template = this.templates().find(
      (t: any) => t['_declarationTContainer'].localNames[0] === column.template
    );
    return template || null;
  }

  getFilterTemplate(column: any): TemplateRef<any> | null {
    const template = this.templates().find(
      (t: any) =>
        t['_declarationTContainer'].localNames[0] === column.filterTemplate
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
