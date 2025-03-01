import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { saveAs } from 'file-saver';
import { Observable, map } from 'rxjs';
import { API_URL_TOKEN } from '../config/api.config';
import { PagedResult } from '../models/api-types.model';
import {
  RequestModel,
  UpdateFinanceRequestDTO,
  UpdateRequestByRequester,
} from '../models/request.model';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private url = inject(API_URL_TOKEN);
  private baseUrl = `${this.url}/Request`;

  constructor(private http: HttpClient) {}

  invoiceRequest = signal<RequestModel | undefined>(undefined);

  getRequests(): Observable<RequestModel[]> {
    return this.http.get<RequestModel[]>(`${this.baseUrl}`);
  }

  deleteRequest(requestNumber: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${requestNumber}`);
  }

  updateRequestByRequester(
    requestNumber: number,
    updateData: UpdateRequestByRequester
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/UpdateRequestByRequester/${requestNumber}`,
      updateData
    );
  }

  updateRequestByFinance(
    requestNumber: number,
    updateData: UpdateFinanceRequestDTO
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/UpdateRequestByFinance/${requestNumber}`,
      updateData
    );
  }

  updateRequestByTradCompliance(
    requestNumber: number,
    updateData: any
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/UpdateRequestByTradCompliance/${requestNumber}`,
      updateData
    );
  }
  updateRequestByWarehouse(
    requestNumber: number,
    updateData: any
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/UpdateRequestByWarehouse/${requestNumber}`,
      updateData
    );
  }
  getRequestById(id: number): Observable<RequestModel> {
    return this.http.get<RequestModel>(`${this.baseUrl}/${id}`);
  }

  createRequest(requestData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/CreateRequest`, requestData);
  }

  /*createApproverRequest(approverRequestData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/CreateApproverRequest`, approverRequestData);
  }*/
  rejectRequest(requestNumber: number, rejectData: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/RejectRequest/${requestNumber}`,
      rejectData
    );
  }
  downloadInvoice(requestNumber: number): void {
    this.http
      .get(`${this.baseUrl}/${requestNumber}/invoice`, { responseType: 'blob' })
      .pipe(
        map((response: Blob) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          saveAs(blob, `Invoice_${requestNumber}.pdf`);
        })
      )
      .subscribe();
  }
  exportRequestsExcel(): void {
    this.http
      .get(`${this.baseUrl}/ExportRequestsExcel`, { responseType: 'blob' })
      .subscribe((response: Blob) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, `Requests.xlsx`);
      });
  }

  getAllRequests(): Observable<RequestModel[]> {
    return this.http.get<RequestModel[]>(`${this.baseUrl}`);
  }

  getAllRequestsByUser(userId: number): Observable<RequestModel[]> {
    return this.http.get<RequestModel[]>(
      `${this.baseUrl}/by-user?userId=${userId}`
    );
  }

  getAllRequestsByPlants(plantsIds: number[]): Observable<RequestModel[]> {
    let queryParams: string = '';
    plantsIds?.forEach((plantId, index) => {
      queryParams += `plantId=${plantId}&`;
      if (index == plantsIds.length - 1) queryParams += `plantId=${plantId}`;
    });
    return this.http.get<RequestModel[]>(
      `${this.baseUrl}/by-plants?${queryParams}`
    );
  }

  getAllRequestsByShipPoints(shipIds: number[]): Observable<RequestModel[]> {
    let queryParams: string = '';
    shipIds?.forEach((shipId, index) => {
      queryParams += `shipId=${shipId}&`;
      if (index == shipIds.length - 1) queryParams += `shipId=${shipId}`;
    });
    return this.http.get<RequestModel[]>(
      `${this.baseUrl}/by-shippoint?${queryParams}`
    );
  }

  load(
    page: number,
    pageSize: number,
    queryParams?: { [key: string]: any }
  ): Observable<PagedResult<RequestModel>> {
    const params = {
      page: page?.toString(),
      pageSize: pageSize?.toString(),
      ...queryParams,
    };

    return this.http.get<PagedResult<RequestModel>>(`${this.baseUrl}/find`, {
      params,
    });
  }
}
