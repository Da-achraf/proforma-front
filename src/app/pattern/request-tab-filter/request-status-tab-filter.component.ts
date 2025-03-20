import { Component, inject, output } from '@angular/core';
import { RequestStatus } from '../../core/models/requeststatus.model';
import { RadioFilterSkeletonComponent } from '../../ui/components/radio-filter/radio-filter-skeleton.component';
import { RadioFilterComponent } from '../../ui/components/radio-filter/radio.filter.component';
import { RequestStatusTabFilterService } from './status-tab-filter.service';

@Component({
  selector: 'app-request-status-tab-filter',
  template: `
    @if (loading()) {
      <app-radio-filter-skeleton />
    } @else if (options().length != 0) {
      <app-radio-filter
        [options]="options()"
        (optionSelected)="onStatusFilter($event)"
        [initialSelected]="initialSelected()"
      />
    }
  `,
  imports: [RadioFilterComponent, RadioFilterSkeletonComponent],
})
export class RequestStatusTabFilterComponent {
  protected readonly options = inject(RequestStatusTabFilterService).options;
  protected readonly initialSelected = inject(RequestStatusTabFilterService)
    .initialSelected;
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
