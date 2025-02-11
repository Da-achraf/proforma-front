import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { API_URL_TOKEN } from '../config/api.config';
import { Scenario, ScenarioModel, ScenarioUpdate } from '../models/scenario.model';

@Injectable({
  providedIn: 'root',
})
export class ScenarioService {
  private url = inject(API_URL_TOKEN);
  private baseUrl = `${this.url}/Scenario`;

  constructor(private http: HttpClient) {}

  getScenarios(): Observable<ScenarioModel[]> {
    return this.http.get<any[]>(`${this.baseUrl}`).pipe(
      map((scenarios) => {
        return scenarios.map((scenario) => {
          return {
            id: scenario.id_scenario,
            ...scenario,
            items: scenario.items.map((item: any) => {
              return {
                ...item,
                mandatoryFor: item.mandatoryFor?.split(','),
              };
            }),
          };
        });
      })
    );
  }

  getScenarioById(id: number): Observable<ScenarioModel> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map((scenario) => ({
        id: scenario.id_scenario,
        ...scenario,
        items: scenario.items.map((item: any) => {
          return {
            ...item,
            mandatoryFor: item.mandatoryFor?.split(','),
          };
        }),
      }))
    );
  }

  deleteScenarios(id_scenario: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id_scenario}`);
  }

  updateScenarios(id_scenario: number, scenario: ScenarioUpdate): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id_scenario}`, scenario);
  }

  CreateScenarios(scenario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/CreateScenario`, scenario);
  }

  getScenarioAttributes(
    scenarioId: number
  ): Observable<{ attributeName: string; mandatoryFor: string[] }[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${scenarioId}/attributes`);
  }

  getApproversByScenarioId(scenarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${scenarioId}/approvers`);
  }
}
