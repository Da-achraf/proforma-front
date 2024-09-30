import { Component, computed, effect, inject, input, Signal, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { getRequestModificationComponent, getStatusClass } from './helpers';
import { RequestModel } from '../../../models/request.model';
import { UserStoreService } from '../../../services/user-store.service';
import { RequestStrategyFactory } from '../../services/requests-strategies/requests-strategies-factory';
import { RoleEnum } from '../../../models/user/user.model';
import { CreateRequestDialogComponent } from '../../../components/create-request-dialog/create-request-dialog.component';
import { MessageService } from 'primeng/api';
import { RequestStatus, RequestStatusLabelMapping } from '../../../models/requeststatus.model';
import { PaginatorState } from 'primeng/paginator';
import { delay } from 'rxjs';

export type Column = {
  label: string
  isSortable: boolean
}

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
  messageService = inject(MessageService)

  loggedInUser = this.userStore.loggedInUser

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

  columns = signal<Column[]>([
    {label: 'Request Number', isSortable: false},
    {label: 'Date of Submission', isSortable: true},
    {label: 'Status', isSortable: false},
    {label: 'Actions', isSortable: false},
  ])

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

  onPageChange(event: PaginatorState) {
    const first = event.first
    const rows = event.rows

    if (first !== undefined && rows !== undefined) {
      this.first.set(first);
      this.rows.set(rows);
    }
  }
}
