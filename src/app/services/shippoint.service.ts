import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Ship } from '../core/models/ship.model';
import { Observable } from 'rxjs';
import { Scenario } from '../core/models/scenario.model';
import { API_URL_TOKEN } from '../core/api/api.config';

@Injectable({
  providedIn: 'root'
})
export class ShippointService {

  private url = inject(API_URL_TOKEN)
  private baseUrl = `${this.url}/ShipPoint`

  constructor(private http: HttpClient) { }

  getShipPoints(): Observable<Ship[]> {
    return this.http.get<Ship[]>(`${this.baseUrl}`);
  }

  deleteShipPoint(id_ship: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id_ship}`);
  }

  updateShipPoint(id_ship : number,ship: Ship): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id_ship }`,ship);
  }

  CreateShipPoint(ship: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, ship);
  }
}
