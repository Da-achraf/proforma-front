import { Component, computed, inject, signal } from '@angular/core';
import { requestReportTableColumns } from '../../models/request-report.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestModel } from '../../models/request.model';
import { RequestStatus, RequestStatusLabelMapping } from '../../models/requeststatus.model';
import { PaginatorState } from 'primeng/paginator';
import { getStatusClass } from '../../shared/components/tables/helpers';
import { TableUtil } from '../../shared/helpers/table-util';
import { WeightTypeEnum } from '../../shared/pipes/report-table/gross-weight-calculator.pipe';

@Component({
  selector: 'app-requests-report',
  templateUrl: './requests-report.component.html',
  styleUrl: './requests-report.component.css'
})
export class RequestsReportComponent {

  // Dependencies
  private data = inject(MAT_DIALOG_DATA);

  // Enums and Constants
  readonly WeightTypeEnum = WeightTypeEnum;
  
  // Signals and Computed Values
  columns = signal(requestReportTableColumns);
  columnsLength = computed(() => this.columns().length);
  searchValue = signal('');
  requests = signal(this.data.requests);
  rows = signal(10);
  first = signal(0);

  filteredRequests = computed(() => {
    const requests = this.requests();
    const searchValue = this.searchValue();

    if (!requests || requests.length === 0) return [];
    if (searchValue.length === 0) return requests;
    return this.filterRequests(searchValue, requests as RequestModel[]);
  });

  totalRecords = computed(() => this.filteredRequests()?.length ?? 0);

  // Methods
  getStatusClass = getStatusClass;

  private filterRequests(searchValue: string, requests: RequestModel[]): RequestModel[] {
    const lowercasedSearch = searchValue.toLowerCase();
    return requests.filter(request =>
      request.requestNumber.toString().toLowerCase().includes(lowercasedSearch) ||
      RequestStatusLabelMapping[request.status as RequestStatus].toLowerCase().includes(lowercasedSearch) ||
      request.created_at.toLowerCase().includes(lowercasedSearch) ||
      request.trackingNumber.toLowerCase().includes(lowercasedSearch) ||
      request.currency.toLowerCase().includes(lowercasedSearch) ||
      request.incoterm.toLowerCase().includes(lowercasedSearch) ||
      request.invoicesTypes.toLowerCase().includes(lowercasedSearch) ||
      request.modeOfTransport.toLowerCase().includes(lowercasedSearch)
    );
  }

  onExport() {
    TableUtil.exportTableToExcel('reportTable', 'all-requests-report');
  }
}
