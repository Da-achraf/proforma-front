import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RequestItem } from '../models/request-item.model';
import { Observable } from 'rxjs';
import { API_URL_TOKEN } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class RequestItemService {

  private url = inject(API_URL_TOKEN)
  private baseUrl = `${this.url}/RequestItem`

  constructor(private http: HttpClient) { }

  getRequestItems(): Observable<RequestItem[]> {
    return this.http.get<RequestItem[]>(`${this.baseUrl}`);
  }

  deleteRequestItem(id_request_item: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id_request_item}`);
  }

  updateRequestItem(id_request_item : number,requestItem: RequestItem): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id_request_item }`,requestItem);
  }

  saveRequestItem(requestItem: { nameItem: string }): Observable<any> {
    console.log('creating new item: ', requestItem)
    return this.http.post(`${this.baseUrl}/CreateRequestItem`, requestItem)
  }

}
