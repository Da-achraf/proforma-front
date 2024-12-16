import { Component, computed, effect, ElementRef, inject, Renderer2, signal, TemplateRef, viewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { requestReportTableColumns } from '../../models/request-report.model';
import { createdAtFormat, RequestModel, TransformedRequestModel } from '../../models/request.model';
import { exportMenuOptions, ExportMenuOptionsEnum } from '../../models/table.model';
import { getStatusClass } from '../../shared/components/tables/helpers';
import { filterRequests, transformRequest } from '../../shared/helpers/report-table.helper';
import { TableExportService } from '../../shared/services/table-export.service';
import { WeightTypeEnum } from '../../shared/pipes/weight-calculator.pipe';

@Component({
  selector: 'app-requests-report',
  templateUrl: './requests-report.component.html',
  styleUrl: './requests-report.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class RequestsReportComponent {

  // Dependencies
  private data = inject(MAT_DIALOG_DATA)
  private renderer = inject(Renderer2)
  private elementRef = inject(ElementRef)
  private tableExportService = inject(TableExportService)

  // View refs
  exportTableRef = viewChild<TemplateRef<any>>('exportTable')

  // Enums and Constants
  readonly WeightTypeEnum = WeightTypeEnum
  readonly exportMenuOptions = signal(exportMenuOptions)

  // Signals and Computed Values
  columns = signal(requestReportTableColumns)
  columnsLength = computed(() => this.columns().length)
  searchValue = signal('')
  bruteRequests = signal<RequestModel[]>(this.data.requests)
  rows = signal(10)
  first = signal(0)
  selectedExportMenuOption = signal<ExportMenuOptionsEnum | undefined>(undefined)
  isExporting = signal(false)
  exportMenuOpened = signal(false)
  createdAtFormat = signal(createdAtFormat)

  transformedRequests = computed(() =>
    this.bruteRequests().flatMap(req => transformRequest(req))
  )

  // Sorted request (by date of creation 'desc')
  requests = computed(() => {
    return this.transformedRequests().slice().sort(
      (a: TransformedRequestModel, b: TransformedRequestModel) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
  })

  filteredRequests = computed(() => {
    const requests = this.requests();
    const searchValue = this.searchValue();

    if (!requests || requests.length === 0) return [];
    if (searchValue.length === 0) return requests;
    return filterRequests(searchValue, requests);
  });

  paginatedRequests = computed(() => {
    return this.filteredRequests()?.slice(this.first(), this.first() + this.rows())
  }, undefined)

  totalRecords = computed(() => this.filteredRequests()?.length ?? 0);

  requestsToExport = computed(() => {
    switch (this.selectedExportMenuOption()) {
      case ExportMenuOptionsEnum.CURRENT_PAGE:
        return this.paginatedRequests()
      case ExportMenuOptionsEnum.FILTERED_ITEMS:
        return this.filteredRequests()
      case ExportMenuOptionsEnum.FULL_EXPORT:
        return this.transformedRequests()
      default:
        return
    }
  })


  // Effects
  requestsToExportSetEffect = effect(async () => {
    const requestsToExport = this.requestsToExport()

    if (!requestsToExport) return

    await this.onExport()

  }, {allowSignalWrites: true})


  // Methods
  getStatusClass = getStatusClass;
  
  private async onExport() {
    this.isExporting.set(true)
    try {
      this.tableExportService.exportTemplateToExcel(
        this.exportTableRef(),
        this.renderer,
        this.elementRef,
        'Export'
      );
    } finally {
      this.isExporting.set(false)
      this.selectedExportMenuOption.set(undefined)
    }
  }

  onPageChange(event: PageEvent) {
    const { pageIndex, pageSize } = event;

    if (typeof pageIndex === 'number' && typeof pageSize === 'number') {
      this.first.set(pageIndex * pageSize)
      this.rows.set(pageSize)
    }
  }
}
