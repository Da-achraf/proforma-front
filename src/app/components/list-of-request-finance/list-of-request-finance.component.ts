import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RequestStatusLabelMapping, RequestStatus } from '../../models/requeststatus.model';
import { RequestService } from '../../services/request.service';
import { ModifyRequestFinanceComponent } from '../modify-request-finance/modify-request-finance.component';

@Component({
  selector: 'app-list-of-request-finance',
  templateUrl: './list-of-request-finance.component.html',
  styleUrls: ['./list-of-request-finance.component.css'],
})
export class ListOfRequestFinanceComponent implements OnInit {
  requests: any[] = [];
  filteredRequests: any[] = [];
  paginatedRequests: any[] = [];
  rows = 10;

  constructor(
    private requestService: RequestService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.requestService.getRequests().subscribe(
      (requests) => {
        console.log('reqs', requests)
        this.requests = requests;
        this.filteredRequests = requests;
        this.paginate({ first: 0, rows: this.rows }); // Initialize pagination
      },
      (error) => {
        console.error('Error loading requests:', error);
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

  openUpdateRequestDialog(requestNumber: number): void {
    const dialogRef = this.dialog.open(ModifyRequestFinanceComponent, {
      width: '800px',
      data: { requestNumber: requestNumber }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadRequests(); // Reload the requests after closing the dialog
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase(); // Convert to lowercase
    this.filteredRequests = this.requests.filter(request =>
      request.requestNumber.toString().toLowerCase().includes(filterValue) ||
      request.operationtype.toLowerCase().includes(filterValue) ||
      this.getRequestStatusLabel(request.status).toLowerCase().includes(filterValue)
    );
    this.paginate({ first: 0, rows: this.rows }); // Reset pagination after filtering
    console.log('Filter value:', filterValue);
  }

  paginate(event: any): void {
    this.paginatedRequests = this.filteredRequests.slice(event.first, event.first + event.rows);
  }
  exportRequestsExcel(): void {
    this.requestService.exportRequestsExcel();
  }
}
