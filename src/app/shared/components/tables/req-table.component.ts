import { Component, computed, effect, inject, input, Signal, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { getRequestModificationComponent, getStatusClass } from './helpers';
import { adminRequestColumns, otherUsersRequestColumns, RequestModel } from '../../../models/request.model';
import { UserStoreService } from '../../../services/user-store.service';
import { RequestStrategyFactory } from '../../services/requests-strategies/requests-strategies-factory';
import { RoleEnum } from '../../../models/user/user.model';
import { CreateRequestDialogComponent } from '../../../components/create-request-dialog/create-request-dialog.component';
import { MessageService } from 'primeng/api';
import { RequestStatus, RequestStatusLabelMapping } from '../../../models/requeststatus.model';
import { PaginatorState } from 'primeng/paginator';
import { delay, filter, switchMap } from 'rxjs';
import { Column } from '../../../models/table.model';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-reqs-table',
  templateUrl: './req-table.component.html',
  styleUrl: './req-table.component.css'
})
export class RequestsTableComponent {

  dialog = inject(MatDialog)
  auth = inject(AuthService)
  userStore = inject(UserStoreService)
  requestFactory = inject(RequestStrategyFactory)
  requestService = inject(RequestService)
  messageService = inject(MessageService)

  loggedInUser = this.userStore.loggedInUser
  RoleEnum = RoleEnum

  searchValue = signal('')

  requests = signal<RequestModel[] | undefined | null>(undefined)
  filteredRequests = computed(() => {
    const requests = this.requests()
    const searchValue = this.searchValue()

    if (requests?.length === 0) return []
    else if (requests?.length != 0){
      if (searchValue.length === 0) return requests
      return this.filterRequests(searchValue, requests as RequestModel[])
    }
    return null
  }, undefined)
  paginatedRequests = computed(() => {
    const filteredRequests = this.filteredRequests()
    return filteredRequests?.slice(this.first(), this.first() + this.rows())
  }, undefined)

  rows = signal(10)
  first = signal(0)
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

    if (loggedInUser?.role == RoleEnum.ADMIN){
      return adminRequestColumns
    }
    return otherUsersRequestColumns
  })
  
  columnsLength = computed(() => {
    const columns = this.columns()
    return columns.length
  })

  getStatusClass = getStatusClass

  constructor() {
    effect(() => {
      const requests = this.paginatedRequests()
      console.log('paginated requests: ', requests)
    })

    effect(() => {
      const loggedInUser = this.loggedInUser()
      console.log('loggedInUser: ', loggedInUser)
      if (loggedInUser) {
        console.log('Getting the requests...')
        this.requestFactory.getRequests(loggedInUser)
        .pipe(delay(1000))
        .subscribe({
          next: requests => {
            this.requests.set(requests)
            console.log('Got following requests: ', requests)
          }
        })
      }
    })
  }

  ngOnInit() {
    const userId = this.auth.getUserIdFromToken()
    this.userStore.getLoggedInUser(userId)
    console.log('UserId: ', userId)
  }

  loadRequests() {
    const userId = this.auth.getUserIdFromToken()
    this.userStore.getLoggedInUser(userId)
    console.log('UserId: ', userId)
  }

  openUpdateRequestDialog(requestNumber: number): void {
    const role = this.auth.getRoleFromToken()
    const component = getRequestModificationComponent(role)
    if (!component)
      return

    const dialogRef = this.dialog.open(component, {
      width: '800px',
      data: { requestNumber }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed ', result)
      if (result) this.loadRequests()
    });
  }

  openCreateRequestDialog(): void {
    const dialogRef = this.dialog.open(CreateRequestDialogComponent, {
      width: '800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Request created successfully' });
        this.loadRequests();
      }
    });
  }

  private filterRequests(searchValue: string, requests: RequestModel[]): RequestModel[] {    
    return requests.filter(request =>
      request.requestNumber.toString().toLowerCase().includes(searchValue) ||
      RequestStatusLabelMapping[request.status as RequestStatus].toLowerCase().includes(searchValue) ||
      request.created_at.toLowerCase().includes(searchValue)
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
        this.showSuccessMessage('Request Deleted successfully.')
        this.loadRequests();
      },
      error: () => {
        this.showErrorMessage('Error in deleting ship point')
      }
    })
  }


  private showErrorMessage(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  private showSuccessMessage(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  onPageChange(event: PaginatorState) {
    const first = event.first
    const rows = event.rows

    if (first !== undefined && rows !== undefined) {
      this.first.set(first);
      this.rows.set(rows);
    }
  }
}
