import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_TOKEN } from '../config/api.config';
import { TransformedRequestModel } from '../models/request.model';
import { QueryParamType } from '../models/api-types.model';

@Injectable({ providedIn: 'root' })
export class RequestExportService {
  private readonly url = inject(API_URL_TOKEN);
  private readonly http = inject(HttpClient);

  exportRequestsReport(params?: QueryParamType): Observable<Blob> {
    return this.http.post(`${this.url}/report/requests`, null, {
      params,
      responseType: 'blob',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  getReportPreview(
    params?: QueryParamType
  ): Observable<TransformedRequestModel[]> {
    return this.http.get<TransformedRequestModel[]>(
      `${this.url}/report/preview`,
      {
        params,
      }
    );
  }

  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
