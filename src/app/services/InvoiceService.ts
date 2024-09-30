// invoice.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL_TOKEN } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private url = inject(API_URL_TOKEN)
  private baseUrl = `${this.url}/invoice`

  constructor(private http: HttpClient) { }

  generateInvoice(requestId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/generate/${requestId}`, { responseType: 'blob' });
  }
}
