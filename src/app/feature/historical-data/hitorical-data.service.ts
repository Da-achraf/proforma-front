import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_TOKEN } from '../../core/api/api.config';
import {
  BulkUploadResult,
  HistoricalData,
  HistoricalDataCreate,
  HistoricalDataUpdate,
} from '../../core/models/historical-data.model';
import { PagedResult, QueryParamType } from '../../core/models/api-types.model';
import { UUIDTypes } from 'uuid';

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
    queryParams?: QueryParamType,
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
      `${this.baseUrl}/material/${material}`,
    );
  }

  save(body: HistoricalDataCreate): Observable<HistoricalData> {
    return this.http.post<HistoricalData>(`${this.baseUrl}`, body);
  }

  update(
    body: Partial<HistoricalDataUpdate>,
    id: number,
  ): Observable<HistoricalData> {
    return this.http.put<HistoricalData>(`${this.baseUrl}/${id}`, body);
  }

  uploadExcel(
    file: File,
    uploadId: string,
  ): Observable<BulkUploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      'Upload-Id': uploadId,
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
