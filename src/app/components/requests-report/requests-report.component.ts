import { Component, computed, ElementRef, inject, Renderer2, signal, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { requestReportTableColumns } from '../../models/request-report.model';
import { createdAtFormat, RequestModel } from '../../models/request.model';
import { RequestStatus, RequestStatusLabelMapping } from '../../models/requeststatus.model';
import { exportMenuOptions, ExportMenuOptionsEnum } from '../../models/table.model';
import { getStatusClass } from '../../shared/components/tables/helpers';
import { TableUtil } from '../../shared/helpers/table-util';
import { WeightTypeEnum } from '../../shared/pipes/report-table/gross-weight-calculator.pipe';

@Component({
  selector: 'app-requests-report',
  templateUrl: './requests-report.component.html',
  styleUrl: './requests-report.component.css',
  encapsulation: ViewEncapsulation.None
})
export class RequestsReportComponent {

  // Dependencies
  private data = inject(MAT_DIALOG_DATA)
  private renderer = inject(Renderer2)
  private elementRef = inject(ElementRef)

  // View refs
  @ViewChild('exportTable') exportTableRef!: TemplateRef<any>;

  // Enums and Constants
  readonly WeightTypeEnum = WeightTypeEnum;
  readonly exportMenuOptions = signal(exportMenuOptions)

  // Signals and Computed Values
  columns = signal(requestReportTableColumns)
  columnsLength = computed(() => this.columns().length)
  searchValue = signal('')
  bruteRequests = signal(this.data.requests)
  requestsToExport = signal<any[]>([])
  rows = signal(10)
  first = signal(0)
  isExporting = signal(false)
  exportMenuOpened = signal(false)
  createdAtFormat = signal(createdAtFormat)
  
  // Sorted request (by date of creation 'desc')
  requests = computed(() => {
    const bruteRequests = this.bruteRequests()
    return bruteRequests.slice().sort((a: any, b: any) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
  })

  filteredRequests = computed(() => {
    const requests = this.requests();
    const searchValue = this.searchValue();

    if (!requests || requests.length === 0) return [];
    if (searchValue.length === 0) return requests;
    return this.filterRequests(searchValue, requests as RequestModel[]);
  });

  paginatedRequests = computed(() => {
    const filteredRequests = this.filteredRequests()
    return filteredRequests?.slice(this.first(), this.first() + this.rows())
  }, undefined)

  totalRecords = computed(() => this.filteredRequests()?.length ?? 0);

  // Methods
  getStatusClass = getStatusClass;

  private filterRequests(searchValue: string, requests: RequestModel[]): RequestModel[] {
    const searchKeyword = searchValue.trim().toLowerCase();
    return requests.filter(request =>
      request.requestNumber.toString().toLowerCase().includes(searchKeyword) ||
      RequestStatusLabelMapping[request.status as RequestStatus].toLowerCase().includes(searchKeyword) ||
      request.created_at.toLowerCase().includes(searchKeyword) ||
      request.trackingNumber.toLowerCase().includes(searchKeyword) ||
      request.currency.toLowerCase().includes(searchKeyword) ||
      request.incoterm.toLowerCase().includes(searchKeyword) ||
      request.invoicesTypes.toLowerCase().includes(searchKeyword) ||
      request.modeOfTransport.toLowerCase().includes(searchKeyword) ||
      request.shipPoint.shipPoint.toLocaleLowerCase().includes(searchKeyword) ||
      request.deliveryAddress.deliveryAddress.toLocaleLowerCase().includes(searchKeyword) ||
      request.user.userName.toLocaleLowerCase().includes(searchKeyword)
    );
  }

  setRequestsToExport(selectedMenuItem: ExportMenuOptionsEnum) {
    switch (selectedMenuItem) {
      case ExportMenuOptionsEnum.CURRENT_PAGE:
        this.requestsToExport.set(this.paginatedRequests())
        break;
      case ExportMenuOptionsEnum.FILTERED_ITEMS:
        this.requestsToExport.set(this.filteredRequests())
        break;
      case ExportMenuOptionsEnum.FULL_EXPORT:
        this.requestsToExport.set(this.bruteRequests())
        break;
    }
  }

  async onExportMenuItemSelected(selectedMenuItem: ExportMenuOptionsEnum) {
    this.setRequestsToExport(selectedMenuItem)
    if (this.requestsToExport().length != 0) await this.onExport()
  }

  async onExport() {
    this.isExporting.set(true)
    setTimeout(async () => {
      TableUtil.exportTemplateToExcel(
        this.exportTableRef,
        this.renderer,
        this.elementRef,
        'FullExport'
      );
      this.isExporting.set(false)
    }, 700);
  }

  onPageChange(event: PageEvent) {
    const { pageIndex, pageSize } = event;

    if (typeof pageIndex === 'number' && typeof pageSize === 'number') {
      this.first.set(pageIndex * pageSize)
      this.rows.set(pageSize)
    }
  }
}
