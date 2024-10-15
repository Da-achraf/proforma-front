import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FieldTypeEnum, ItemModel, RequestItem, RequestItemModel } from '../models/request-item.model';
import { Observable } from 'rxjs';
import { API_URL_TOKEN } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class RequestItemService {

  private url = inject(API_URL_TOKEN)
  private baseUrl = `${this.url}/RequestItem`

  constructor(private http: HttpClient) { }

  getRequestItems(): Observable<RequestItemModel[]> {
    return this.http.get<RequestItemModel[]>(`${this.baseUrl}`);
  }

  deleteRequestItem(id_request_item: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id_request_item}`);
  }

  updateRequestItem(id_request_item : number, requestItem: ItemModel): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id_request_item }`,requestItem);
  }

  saveRequestItem(requestItem: { nameItem: string }): Observable<RequestItemModel> {
    return this.http.post<RequestItemModel>(`${this.baseUrl}/CreateRequestItem`, requestItem)
  }

  saveRequestItemWithFields(requestItem: {nameItem: string, type: FieldTypeEnum}): Observable<any> {
    console.log('creating new item: ', requestItem)
    return this.http.post(`${this.baseUrl}/with-fields`, requestItem)
  }

}
