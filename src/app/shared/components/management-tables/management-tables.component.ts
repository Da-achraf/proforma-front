import { NgClass, TitleCasePipe } from '@angular/common';
import {
  Component,
  computed,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTooltip } from '@angular/material/tooltip';
import {
  Column,
  TableNameEnum,
  TableProperty,
} from '../../../core/models/table.model';
import { SearchBarComponent } from '../../../pattern/search/search-bar.component';
import { CreateButtonComponent } from '../../../ui/components/create-button/create-button.component';
import { NoDataFoundComponent } from '../../../ui/components/no-data-found/no-data-found.component';
import {
  ISearchFilterStrategy,
  searchFilterStrategyFactory,
} from '../../helpers/table-search-filters.helper';
import { IsPropertyNotEmptyPipe } from '../../pipes/is-property-empty.pipe';
import { TruncateTextPipe } from '../../pipes/truncate-text.pipe';
import { UserRoleForDisplayPipe } from '../../pipes/user-role-for-display.pipe';
import { LoadingDotsComponent } from '../loading-dots/loading-dots.component';

@Component({
  selector: 'app-management-tables',
  templateUrl: './management-tables.component.html',
  styleUrl: './management-tables.component.css',
  imports: [
    TitleCasePipe,
    SearchBarComponent,
    CreateButtonComponent,
    NgClass,
    IsPropertyNotEmptyPipe,
    UserRoleForDisplayPipe,
    TruncateTextPipe,
    MatTooltip,
    NoDataFoundComponent,
    LoadingDotsComponent,
    MatPaginator,
  ],
})
export class ManagementTablesComponent<T> implements OnInit {
  // Inputs
  tableName = input<TableNameEnum | string>('');
  columns = input<Column[]>([]);
  items = input<any[] | null | undefined>(undefined);
  tableProperties = input<TableProperty[]>([]);
  showCreateButton = input<boolean>(true);
  showUpdateAction = input<boolean>(true);
  showDeleteAction = input<boolean>(true);

  // Outputs
  onCreate = output<void>();
  onDelete = output<number>();
  onUpdate = output<T>();

  // Computed signals
  itemUniqueKey = computed(() => {
    const tableProperties = this.tableProperties();
    return tableProperties[0].name;
  });

  columnsLength = computed(() => {
    const columns = this.columns();
    return columns.length;
  });

  // Signals
  searchValue = signal('');
  rows = signal(10);
  first = signal(0);
  totalRecords = computed(() => {
    return this.filteredItems()?.length;
  });

  filteredItems = computed(() => {
    const items = this.items();
    const searchValue = this.searchValue();

    if (items?.length === 0) return [];
    else if (items?.length != 0) {
      if (searchValue.length === 0) return items;
      return this.searchFilterStrategy.filter(
        searchValue.toLowerCase(),
        items as T[],
      );
    }
    return null;
  }, undefined);

  paginatedItems = computed(() => {
    const filteredItems = this.filteredItems();
    return filteredItems?.slice(this.first(), this.first() + this.rows());
  }, undefined);

  // Properties
  searchFilterStrategy!: ISearchFilterStrategy<T>;

  // Hooks
  ngOnInit(): void {
    const tableName = this.tableName();
    if (tableName.length != 0) {
      this.searchFilterStrategy = searchFilterStrategyFactory(
        this.tableName() as TableNameEnum,
      ) as ISearchFilterStrategy<T>;
    }
  }

  // Outputs triggers
  onCreateClicked() {
    this.onCreate.emit();
  }

  onDeleteClicked(id: number) {
    console.log('emitting on delete for id: ', id);
    this.onDelete.emit(id);
  }

  onUpdateClicked(item: T) {
    this.onUpdate.emit(item);
  }

  // Methods
  // onPageChange(event: PaginatorState) {
  //   const first = event.first
  //   const rows = event.rows

  //   if (first !== undefined && rows !== undefined) {
  //     this.first.set(first);
  //     this.rows.set(rows);
  //   }
  // }

  onPageChange(event: PageEvent) {
    const { pageIndex, pageSize } = event;

    if (typeof pageIndex === 'number' && typeof pageSize === 'number') {
      this.first.set(pageIndex * pageSize);
      this.rows.set(pageSize);
    }
  }
}
