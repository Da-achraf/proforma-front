import { Component, inject, signal } from '@angular/core';
import { HistoricalDataStore } from '../historical-data.store';
import { COLUMNS } from './const';

@Component({
  selector: 'app-historical-data-list',
  templateUrl: 'historical-data-list.component.html',
})
export class HistoricalDataListComponent {
  protected readonly store = inject(HistoricalDataStore);

  protected columns = signal(COLUMNS).asReadonly();

  onSearch(term: string) {
    this.store.setQueryParams({ search: term });
  }
}
