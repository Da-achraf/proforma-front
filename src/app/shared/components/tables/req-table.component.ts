import { Component, computed, effect, ElementRef, inject, Renderer2, signal, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { delay, filter, switchMap } from 'rxjs';
import { CreateRequestDialogComponent } from '../../../components/create-request-dialog/create-request-dialog.component';
import { RequestsReportComponent } from '../../../components/requests-report/requests-report.component';
import { createdAtFormat, otherUsersRequestColumns, RequestModel, sharedRequestColumns } from '../../../models/request.model';
import { RequestStatus, RequestStatusLabelMapping } from '../../../models/requeststatus.model';
import { RoleEnum } from '../../../models/user/user.model';
import { AuthService } from '../../../services/auth.service';
import { RequestService } from '../../../services/request.service';
import { UserStoreService } from '../../../services/user-store.service';
import { createRequestSorter, sortRequestsByDate } from '../../helpers/request-sorting.helper';
import { InvoiceService } from '../../services/invoice.service';
import { RequestStrategyFactory } from '../../services/requests-strategies/requests-strategies-factory';
import { ToasterService } from '../../services/toaster.service';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { getRequestModificationComponent, getStatusClass } from './helpers';
import { DatePipe } from '@angular/common';
import { SideNavService } from '../../services/side-nav.service';
import { HTTP_REQUEST_DELAY } from '../../constants/http-requests.constant';

@Component({
  selector: 'app-reqs-table',
  templateUrl: './req-table.component.html',
  styleUrl: './req-table.component.css',
  providers: [DatePipe]
})
export class RequestsTableComponent {

  // Injected dependencies
  dialog = inject(MatDialog)
  auth = inject(AuthService)
  userStore = inject(UserStoreService)
  requestFactory = inject(RequestStrategyFactory)
  requestService = inject(RequestService)
  toasterService = inject(ToasterService)
  renderer = inject(Renderer2)
  elementRef = inject(ElementRef)
  invoiceService = inject(InvoiceService)
  datePipe = inject(DatePipe)
  sideNavService = inject(SideNavService)

  // Enums and constants
  RoleEnum = RoleEnum

  // View refs
  @ViewChild('invoiceElement') invoiceElement!: TemplateRef<any>;

  // Signals and computed values
  loggedInUser = this.userStore.loggedInUser
  invoiceRequest = this.requestService.invoiceRequest
  searchValue = signal('')
  requests = signal<RequestModel[] | undefined | null>(undefined)
  rows = signal(10)
  first = signal(0)
  isDownloading = signal(false)
  createdAtFormat = signal(createdAtFormat)
  requestSortingOrder = signal<'asc' | 'desc'>('desc')
  requestSortingIconVisible = signal(true)

  sortedRequests = computed(() => {
    const requests = this.requests()
    const loggedInUserRole = this.loggedInUser()?.role as RoleEnum;
    if (!requests) return
    const order = this.requestSortingOrder()
    return createRequestSorter(requests)
      .byRoleRelevance(loggedInUserRole)
      .byDate(order)
      .build()
  }, undefined)

  filteredRequests = computed(() => {
    const requests = this.sortedRequests()
    const searchValue = this.searchValue()

    if (requests?.length === 0) return []
    else if (requests?.length != 0) {
      if (searchValue.length === 0) return requests
      return this.filterRequests(searchValue.toLowerCase(), requests as RequestModel[])
    }
    return null
  }, undefined)

  paginatedRequests = computed(() => {
    const filteredRequests = this.filteredRequests()
    return filteredRequests?.slice(this.first(), this.first() + this.rows())
  }, undefined)

  totalRecords = computed(() => {
    const filteredRequests = this.filteredRequests()
    return filteredRequests?.length
  })

  showCreateButton = computed(() => {
    const loggedInUser = this.loggedInUser()
    return loggedInUser && loggedInUser.role == RoleEnum.REQUESTER
  })

  showUpdateButton = computed(() => {
    const loggedInUser = this.loggedInUser()
    return loggedInUser && loggedInUser.role != RoleEnum.ADMIN
  })

  columns = computed(() => {
    const loggedInUser = this.loggedInUser()

    if (loggedInUser?.role == RoleEnum.ADMIN) {
      return sharedRequestColumns
    }
    return otherUsersRequestColumns
  })

  columnsLength = computed(() => {
    const columns = this.columns()
    return columns.length
  })

  constructor() {
    effect(() => {
      const loggedInUser = this.loggedInUser()
      if (loggedInUser) {
        this.requestFactory.getRequests(loggedInUser)
          .pipe(delay(HTTP_REQUEST_DELAY))
          .subscribe({
            next: requests => {
              this.requests.set(requests)
              this.sideNavService.requests.set(requests)
            }
          })
      }
    })
  }

  ngOnInit() {
    const userId = this.auth.getUserIdFromToken()
    this.userStore.getLoggedInUser(userId)
  }

  // Methods
  getStatusClass = getStatusClass

  loadRequests() {
    const userId = this.auth.getUserIdFromToken()
    this.userStore.getLoggedInUser(userId)
  }

  openUpdateRequestDialog(requestNumber: number): void {
    const role = this.auth.getRoleFromToken()
    const component = getRequestModificationComponent(role)
    if (!component)
      return

    const dialogRef = this.dialog.open(component, {
      width: '70vw',
      maxHeight: '90vh',
      data: { requestNumber }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadRequests()
    });
  }

  openCreateRequestDialog(): void {
    const dialogRef = this.dialog.open(CreateRequestDialogComponent, {
      width: '70vw',
      maxHeight: '90vh'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toasterService.showSuccessMessage('Request created successfully')
        this.loadRequests();
      }
    });
  }

  onOpenReportDialog() {
    this.dialog.open(RequestsReportComponent, {
      minWidth: '800px',
      maxWidth: '85vw',
      maxHeight: '95vh',
      data: { requests: this.requests() }
    });
  }

  private filterRequests(searchValue: string, requests: RequestModel[]): RequestModel[] {

    const formatedDate = this.datePipe.transform('')

    return requests.filter(request =>
      request.requestNumber.toString().toLowerCase().includes(searchValue) ||
      RequestStatusLabelMapping[request.status as RequestStatus].toLowerCase().includes(searchValue) ||
      this.datePipe.transform(request.created_at)?.toLowerCase().includes(searchValue)
    );
  }

  cancelRequest(reqNumber: number) {
    if (!reqNumber) return
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        label: 'request'
      }
    })

    dialogRef.afterClosed().pipe(
      filter(result => result),
      switchMap(_ => this.requestService.deleteRequest(reqNumber))
    ).subscribe({
      next: () => {
        this.toasterService.showSuccessMessage('Request Deleted successfully.')
        this.loadRequests();
      },
      error: () => {
        this.toasterService.showErrorMessage('Error in deleting ship point')
      }
    })
  }

  triggerDownload() {
    this.isDownloading.set(true)
  }

  async download(req: any) {
    this.invoiceRequest.set(req)

    let resolved = false
    try {
        resolved = await this.invoiceService.downloadInvoice(req.requestNumber, this.invoiceElement, this.renderer, this.elementRef)
    } catch (error) {
      console.error('error generating pdf: ', error)
      this.isDownloading.set(false)
    }

    while (1){
      if (resolved) {
        this.isDownloading.set(false)
        this.invoiceRequest.set(undefined)
        break
      }
    }
  }

  /**
   * Pagination using angular material
   */
  onPageChange(event: PageEvent) {
    const { pageIndex, pageSize } = event;

    if (typeof pageIndex === 'number' && typeof pageSize === 'number') {
      this.first.set(pageIndex * pageSize)
      this.rows.set(pageSize)
    }
  }

  onToggleSortingOrder(sortingOrder: 'asc' | 'desc') {
    this.requestSortingIconVisible.set(false)
    const newOrder: 'asc' | 'desc' = sortingOrder === 'asc' ? 'desc' : 'asc'
    setTimeout(() => {
      this.requestSortingOrder.set(newOrder)
      this.requestSortingIconVisible.set(true)
    }, 150);
  }
}
