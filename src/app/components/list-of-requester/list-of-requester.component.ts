import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateRequestDialogComponent } from '../create-request-dialog/create-request-dialog.component';
import { RequestStatus, RequestStatusLabelMapping } from '../../models/requeststatus.model'; // Import the enums
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-list-of-requester',
  templateUrl: './list-of-requester.component.html',
  styleUrls: ['./list-of-requester.component.css']
})
export class ListOfRequesterComponent implements OnInit {
  requests: any[] = [];
  filteredRequests: any[] = [];
  paginatedRequests: any[] = [];
  rows = 10;

  constructor(
    private requestService: RequestService,
    private router: Router,
    private dialog: MatDialog,
    private messageService: MessageService // Inject MessageService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.requestService.getRequests().subscribe(
      (requests) => {
        this.requests = requests;
        this.filteredRequests = requests;
        this.paginate({ first: 0, rows: this.rows }); // Initialiser la pagination
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading requests' });
        console.error('Error loading requests', error);
      }
    );
  }

  getRequestStatusLabel(status: number): string {
    return RequestStatusLabelMapping[status as RequestStatus];
  }
  getStatusClass(status: number): string {
    switch (status) {
      case RequestStatus.PendingInFinance:
        return 'status-pending-finance';
      case RequestStatus.PendingInTradCompliance:
        return 'status-pending-trad';
      case RequestStatus.InShipping:
        return 'status-in-shipping';
      case RequestStatus.Done:
        return 'status-done';
      case RequestStatus.Rejected:
        return 'status-rejected';
      default:
        return '';
    }
  }
  openCreateRequestDialog(): void {
    const dialogRef = this.dialog.open(CreateRequestDialogComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Request created successfully' });
        this.loadRequests();
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase(); // Convert to lowercase
    this.filteredRequests = this.requests.filter(request =>
      request.requestNumber.toString().toLowerCase().includes(filterValue) ||
      request.operationtype.toLowerCase().includes(filterValue) ||
      this.getRequestStatusLabel(request.status).toLowerCase().includes(filterValue) ||
      request.created_at.toLowerCase().includes(filterValue) // If you want to filter by date
    );
    this.paginate({ first: 0, rows: this.rows }); // Reset pagination after filtering
    console.log('Filter value:', filterValue);
  }

  paginate(event: any): void {
    this.paginatedRequests = this.filteredRequests.slice(event.first, event.first + event.rows);
  }

  deleteRequest(requestNumber: number | undefined): void {
    if (!requestNumber) {
      console.log('Request ID is undefined or null.');
      return;
    }

    if (confirm('Are you sure you want to cancel this request?')) {
      this.requestService.deleteRequest(requestNumber).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Request deleted successfully' });
          this.loadRequests();
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting request' });
          console.log('Error deleting request:', error);
        }
      );
    }
  }
  exportRequestsExcel(): void {
    this.requestService.exportRequestsExcel();
  }
}