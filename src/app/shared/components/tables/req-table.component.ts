import { DatePipe, NgClass } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  Renderer2,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { CreateRequestDialogComponent } from '../../../components/create-request-dialog/create-request-dialog.component';
import { RequestsReportComponent } from '../../../components/requests-report/requests-report.component';
import {
  createdAtFormat,
  otherUsersRequestColumns,
  sharedRequestColumns,
} from '../../../models/request.model';
import { RequestStatus } from '../../../models/requeststatus.model';
import { RoleEnum } from '../../../models/user/user.model';
import { RequestStatusTabFilterComponent } from '../../../pattern/request-tab-filter/request-status-tab-filter.component';
import { SearchBarComponent } from '../../../pattern/search/search-bar.component';
import { AuthService } from '../../../services/auth.service';
import { RequestService } from '../../../services/request.service';
import { UserStoreService } from '../../../services/user-store.service';
import { CreateButtonComponent } from '../../../ui/components/create-button/create-button.component';
import { NoDataFoundComponent } from '../../../ui/components/no-data-found/no-data-found.component';
import { InvoiceAvailabilityPipe } from '../../pipes/invoice-availablity.pipe';
import { InvoiceService } from '../../services/invoice.service';
import { RequestStrategyFactory } from '../../services/requests-strategies/requests-strategies-factory';
import { SideNavService } from '../../services/side-nav.service';
import { ToasterService } from '../../services/toaster.service';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { LoadingDotsComponent } from '../loading-dots/loading-dots.component';
import { RequestStatusComponent } from '../request-status/request-status.component';
import { TheInvoiceComponent } from '../the-invoice/the-invoice.component';
import { PAGE_SIZE_OPTIONS } from './data';
import { getRequestModificationComponent } from './helpers';
import { ReportFilterComponent } from './report-filter/report-filter.component';
import { RequestStore } from './request.store';

const REQUEST_EDITING_TIMOUT = 1500;

@Component({
  selector: 'app-reqs-table',
  templateUrl: './req-table.component.html',
  styleUrl: './req-table.component.css',
  imports: [
    RequestStatusTabFilterComponent,
    SearchBarComponent,
    CreateButtonComponent,
    NgClass,
    DatePipe,
    RequestStatusComponent,
    InvoiceAvailabilityPipe,
    MatTooltip,
    LoadingDotsComponent,
    NoDataFoundComponent,
    MatPaginator,
    TheInvoiceComponent,
  ],
  providers: [DatePipe],
})
export class RequestsTableComponent {
  // Injected dependencies
  dialog = inject(MatDialog);
  auth = inject(AuthService);
  userStore = inject(UserStoreService);
  requestFactory = inject(RequestStrategyFactory);
  requestService = inject(RequestService);
  toasterService = inject(ToasterService);
  renderer = inject(Renderer2);
  elementRef = inject(ElementRef);
  invoiceService = inject(InvoiceService);
  datePipe = inject(DatePipe);
  sideNavService = inject(SideNavService);
  requestStore = inject(RequestStore);

  router = inject(Router);
  route = inject(ActivatedRoute);

  // Server side pagination for requests
  _requests = this.requestStore.requests;
  _loading = this.requestStore.loading;
  _totalRecords = this.requestStore.totalItems;
  _rows = this.requestStore.pageSize;
  pageSizeOptions = signal(inject(PAGE_SIZE_OPTIONS));

  timeoutId!: NodeJS.Timeout;

  // Enums and constants
  RoleEnum = RoleEnum;
  RequestStatusEnum = RequestStatus;

  // View refs
  @ViewChild('invoiceElement') invoiceElement!: TemplateRef<any>;

  // Signals and computed values
  loggedInUser = this.userStore.loggedInUser;
  invoiceRequest = this.requestService.invoiceRequest;

  isDownloading = signal(false);
  beingEdited = signal<number | undefined>(undefined); // To apply specific styling on request opened for editing

  protected readonly createdAtFormat = signal(createdAtFormat);

  requestSortingOrder = signal<'asc' | 'desc'>('desc');
  requestSortingIconVisible = signal(true);

  canViewReport = computed(() =>
    [RoleEnum.ADMIN, RoleEnum.WAREHOUSE_APPROVER].some(
      (r) => r === this.loggedInUser()?.role,
    ),
  );

  onStatusChange(status: RequestStatus | undefined) {
    this.requestStore.setQueryParams({ status });
  }

  onSearch(search: string) {
    this.requestStore.setQueryParams({ search });
  }

  showCreateButton = computed(() => {
    const loggedInUser = this.loggedInUser();
    return loggedInUser && loggedInUser.role == RoleEnum.REQUESTER;
  });

  showUpdateButton = computed(() => {
    const loggedInUser = this.loggedInUser();
    return loggedInUser && loggedInUser.role != RoleEnum.ADMIN;
  });

  columns = computed(() => {
    const loggedInUser = this.loggedInUser();

    if (loggedInUser?.role == RoleEnum.ADMIN) {
      return sharedRequestColumns;
    }
    return otherUsersRequestColumns;
  });

  columnsLength = computed(() => {
    const columns = this.columns();
    return columns.length;
  });

  constructor() {
    const requestNumber = this.route.snapshot.queryParamMap.get('req-no');
    if (requestNumber) this.openUpdateRequestDialog(+requestNumber);
  }

  ngOnInit() {
    const userId = this.auth.getUserIdFromToken();
    this.userStore.getLoggedInUser(userId);
  }

  // Methods

  openUpdateRequestDialog(requestNumber: number): void {
    const role = this.auth.getRoleFromToken();
    const component = getRequestModificationComponent(role);
    if (!component) return;

    const dialogRef = this.dialog.open(component, {
      width: '70vw',
      maxHeight: '90vh',
      data: { requestNumber },
    });

    // Clear query parameters immediately after opening the dialog
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true, // Replaces current URL in history
    });

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.beingEdited.set(requestNumber);

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) this.requestStore.triggerReloading();
      },
      complete: () => {
        this.timeoutId = setTimeout(() => {
          this.beingEdited.set(undefined);
        }, REQUEST_EDITING_TIMOUT);
      },
    });
  }

  openCreateRequestDialog(): void {
    const dialogRef = this.dialog.open(CreateRequestDialogComponent, {
      width: '70vw',
      maxHeight: '90vh',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.toasterService.showSuccess('Request created successfully');
        this.requestStore.triggerReloading();
      }
    });
  }

  onOpenReportDialog() {
    this.dialog.open(RequestsReportComponent, {
      minWidth: '800px',
      maxWidth: '85vw',
      maxHeight: '95vh',
      data: { requests: this.requestStore.requests() },
    });
  }

  async exportData() {
    this.dialog.open(ReportFilterComponent, {});
    // await this.requestStore.exportData();
  }

  cancelRequest(reqNumber: number) {
    if (!reqNumber) return;
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        label: 'request',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap((_) => this.requestService.deleteRequest(reqNumber)),
      )
      .subscribe({
        next: () => {
          this.toasterService.showSuccess('Request Deleted successfully.');
          this.requestStore.triggerReloading();
        },
        error: () => {
          this.toasterService.showError('Error in deleting ship point');
        },
      });
  }

  triggerDownload() {
    this.isDownloading.set(true);
  }

  async download(req: any) {
    this.invoiceRequest.set(req);

    let resolved = false;
    try {
      resolved = await this.invoiceService.downloadInvoice(
        req.requestNumber,
        this.invoiceElement,
        this.renderer,
        this.elementRef,
      );
    } catch (error) {
      console.error('error generating pdf: ', error);
      this.isDownloading.set(false);
    }

    while (1) {
      if (resolved) {
        this.isDownloading.set(false);
        this.invoiceRequest.set(undefined);
        break;
      }
    }
  }

  /**
   * Pagination using angular material
   */
  onPageChange(event: PageEvent) {
    const { pageIndex, pageSize } = event;

    if (typeof pageIndex === 'number' && typeof pageSize === 'number') {
      this.requestStore.setPagination(pageIndex + 1, pageSize);
    }
  }

  onToggleSortingOrder(sortingOrder: 'asc' | 'desc') {
    this.requestSortingIconVisible.set(false);
    const newOrder: 'asc' | 'desc' = sortingOrder === 'asc' ? 'desc' : 'asc';
    setTimeout(() => {
      this.requestStore.setQueryParams({ sortOrder: newOrder });
      this.requestSortingOrder.set(newOrder);
      this.requestSortingIconVisible.set(true);
    }, 150);
  }
}
