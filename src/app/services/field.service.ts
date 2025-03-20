import { inject, Injectable } from '@angular/core';
import { API_URL_TOKEN } from '../core/api/api.config';
import { HttpClient } from '@angular/common/http';
import { ItemField } from '../core/models/request-item.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  private url = inject(API_URL_TOKEN)
  private baseUrl = `${this.url}/fields`
  private http = inject(HttpClient)

  saveField(field: ItemField): Observable<ItemField> {
    return this.http.post<ItemField>(this.baseUrl, field)
  }
  
  getFields(): Observable<ItemField[]> {
    return this.http.get<ItemField[]>(this.baseUrl)
  }

}
