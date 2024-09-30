import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL_TOKEN } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class KpiService {
  private url = inject(API_URL_TOKEN)
  private baseUrl = `${this.url}/kPIs`

  constructor(private http: HttpClient) {

    console.log('hello api: ', this.baseUrl)

  }

  getRequestCountByAllScenarios(): Observable<{ [key: number]: number }> {
    return this.http.get<{ [key: number]: number }>(`${this.baseUrl}/requests-by-all-scenarios`);
  }

  getAllRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all-requests`);
  }

  getRequestCountByCostCenterPerScenario(): Observable<{ [key: string]: { [key: number]: number } }> {
    return this.http.get<{ [key: string]: { [key: number]: number } }>(`${this.baseUrl}/requests-by-costcenter-per-scenario`);
  }
  getRequestCountByCostCenterPerDay(): Observable<{ [key: string]: { [key: string]: number } }> {
    return this.http.get<{ [key: string]: { [key: string]: number } }>(`${this.baseUrl}/requests-by-costcenter-per-day`);
  }
  getAverageFlowTimeForAllRequests(): Observable<{ [key: number]: number }> {
    return this.http.get<{ [key: number]: number }>(`${this.baseUrl}/average-flow-time-all-requests`);
}
}
