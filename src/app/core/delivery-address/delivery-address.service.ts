import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, startWith, Subject, switchMap } from 'rxjs';
import { API_URL_TOKEN } from '../api/api.config';
import { PagedResult, QueryParamType } from '../models/api-types.model';
import {
  DeliveryAddress,
  DeliveryAddressCreate,
  DeliveryAddressUpdate,
} from '../models/delivery-address.model';
import { BulkUploadResult } from '../models/historical-data.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryAddressService {
  private readonly http = inject(HttpClient);
  private readonly url = inject(API_URL_TOKEN);

  private readonly baseUrl = `${this.url}/delivery-addresses`;
  private reloadTrigger = new Subject<void>();

  private allAddressesSignal = toSignal(this.loadAll());
  allAddresses = computed(() => this.allAddressesSignal()?.items ?? []);

  load(
    page: number,
    pageSize: number,
    queryParams?: QueryParamType,
  ): Observable<PagedResult<DeliveryAddress>> {
    const params = {
      page: page?.toString(),
      pageSize: pageSize?.toString(),
      ...queryParams,
    };

    return this.http.get<PagedResult<DeliveryAddress>>(`${this.baseUrl}`, {
      params,
    });
  }

  loadAll() {
    return this.reloadTrigger.pipe(
      switchMap(() => this.load(0, 0, { RetrieveAll: true })),
    );
  }

  triggerLoadAllAddresses() {
    this.reloadTrigger.next();
  }

  loadOne(id: number): Observable<DeliveryAddress> {
    return this.http.get<DeliveryAddress>(`${this.baseUrl}/${id}`);
  }

  getDeliveryAddressByCustomerId(
    customerId: string,
  ): Observable<DeliveryAddress[]> {
    return this.http.get<DeliveryAddress[]>(
      `${this.baseUrl}/customerId/${customerId}`,
    );
  }

  save(body: DeliveryAddressCreate): Observable<DeliveryAddress> {
    return this.http.post<DeliveryAddress>(`${this.baseUrl}`, body);
  }

  update(
    body: Partial<DeliveryAddressUpdate>,
    id: number,
  ): Observable<DeliveryAddress> {
    return this.http.put<DeliveryAddress>(`${this.baseUrl}/${id}`, body);
  }

  uploadExcel(file: File, uploadId: string): Observable<BulkUploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      'Upload-Id': uploadId, // Retrieve this from your authentication service
    });

    return this.http.post<BulkUploadResult>(
      `${this.baseUrl}/bulk-upload`,
      formData,
      { headers },
    );
  }

  deleteOne(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  deleteMany(ids: number[]): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/many`, { body: { ids } });
  }
}
