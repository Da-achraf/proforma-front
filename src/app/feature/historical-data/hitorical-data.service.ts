import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_TOKEN } from '../../config/api.config';
import {
  HistoricalData,
  HistoricalDataCreate,
  HistoricalDataUpdate,
} from '../../models/historical-data.model';
import { PagedResult, QueryParamType } from '../../models/api-types.model';

@Injectable({
  providedIn: 'root',
})
export class HistoricalDataService {
  private readonly http = inject(HttpClient);
  private readonly url = inject(API_URL_TOKEN);

  private readonly baseUrl = `${this.url}/historical-data`;

  load(
    page: number,
    pageSize: number,
    queryParams?: QueryParamType
  ): Observable<PagedResult<HistoricalData>> {
    const params = {
      page: page?.toString(),
      pageSize: pageSize?.toString(),
      ...queryParams,
    };

    return this.http.get<PagedResult<HistoricalData>>(`${this.baseUrl}`, {
      params,
    });
  }

  loadOne(id: number): Observable<HistoricalData> {
    return this.http.get<HistoricalData>(`${this.baseUrl}/${id}`);
  }

  getHistoricalDataByMaterial(material: string): Observable<HistoricalData[]> {
    return this.http.get<HistoricalData[]>(
      `${this.baseUrl}/material/${material}`
    );
  }

  save(body: HistoricalDataCreate): Observable<HistoricalData> {
    return this.http.post<HistoricalData>(`${this.baseUrl}`, body);
  }

  update(
    body: Partial<HistoricalDataUpdate>,
    id: number
  ): Observable<HistoricalData> {
    return this.http.put<HistoricalData>(`${this.baseUrl}/${id}`, body);
  }

  deleteOne(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  deleteMany(ids: number[]): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/many`, { body: { ids } });
  }
}
