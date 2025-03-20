import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL_TOKEN } from '../../core/api/api.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private url = inject(API_URL_TOKEN)
  private baseUrl = `${this.url}/Pdf/generate`
  private http = inject(HttpClient)

  generatePdf(htmlContent: string): Observable<Blob> {

    return this.http.post(this.baseUrl, htmlContent, {
      responseType: 'blob',
      headers: { 'Content-Type': 'text/html' }
    });
  }
}
