import { Component, inject, output } from '@angular/core';
import { RequestStatusTabFilterService } from './status-tab-filter.service';
import { RequestStatus } from '../../models/requeststatus.model';

@Component({
  selector: 'app-request-status-tab-filter',
  template: `
    @if (loading()) {
    <app-radio-filter-skeleton />
    } @else if(options().length != 0) {
    <app-radio-filter
      [options]="options()"
      (optionSelected)="onStatusFilter($event)"
    />
    }
  `,
})
export class RequestStatusTabFilterComponent {
  protected readonly options = inject(RequestStatusTabFilterService).options;
  protected readonly loading = inject(RequestStatusTabFilterService).loading;

  statusFilterChange = output<RequestStatus | undefined>();

  protected onStatusFilter(status: string) {
    try {
      let parsedStatus = Number.parseInt(status) as RequestStatus;
      this.statusFilterChange.emit(parsedStatus);
    } catch (error) {
      this.statusFilterChange.emit(undefined);
    }
  }
}
