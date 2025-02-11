import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SceanrioItemConfiguration } from '../models/sceanrio-item-configuration.model';
import { API_URL_TOKEN } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ScenarioItemConfigurationService {
  getScenarioItemsConfiguration(scenarioId: number) {
    throw new Error('Method not implemented.');
  }

  private url = inject(API_URL_TOKEN);
  private baseUrl = `${this.url}/ScenarioItemConfiguration`;

  constructor(private http: HttpClient) {}

  CreatescenarioItemsConfiguration(
    scenarioItemConfiguration: SceanrioItemConfiguration
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/CreateScenarioItemConfiguration`,
      scenarioItemConfiguration
    );
  }

  updateScenarioItemsConfiguration(
    scenarioItemConfiguration: SceanrioItemConfiguration
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${scenarioItemConfiguration.id}`,
      scenarioItemConfiguration
    );
  }
}
