import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_TOKEN } from '../config/api.config';
import {
  DeliveryAddress,
  DeliveryAddressCreate,
  DeliveryAddressUpdate,
} from '../models/delivery-address.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryAddressService {
  private url = inject(API_URL_TOKEN);
  private baseUrl = `${this.url}/delivery-addresses`;

  constructor(private http: HttpClient) {}

  getDeliveryAddresses(): Observable<DeliveryAddress[]> {
    return this.http.get<DeliveryAddress[]>(`${this.baseUrl}`);
  }

  deleteDeliveryAddress(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  updateDeliveryAddress(
    id: number,
    address: DeliveryAddressUpdate
  ): Observable<DeliveryAddress> {
    return this.http.put<DeliveryAddress>(`${this.baseUrl}/${id}`, address);
  }

  CreateDeliveryAddress(address: DeliveryAddressCreate): Observable<DeliveryAddress> {
    return this.http.post<DeliveryAddress>(`${this.baseUrl}`, address);
  }
}
