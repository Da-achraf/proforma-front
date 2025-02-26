import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_TOKEN } from '../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RequestExportService {
  private readonly url = inject(API_URL_TOKEN);
  private readonly http = inject(HttpClient);

  exportRequests(): Observable<Blob> {
    return this.http.post(`${this.url}/export/requests`, null, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
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
