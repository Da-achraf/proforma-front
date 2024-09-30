import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Scenario } from '../models/scenario.model';
import { Observable } from 'rxjs';
import { API_URL_TOKEN } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  private url = inject(API_URL_TOKEN)
  private baseUrl = `${this.url}/Scenario`

  constructor(private http: HttpClient) { }

  getScenarios(): Observable<Scenario[]> {
    return this.http.get<Scenario[]>(`${this.baseUrl}`);
  }

  deleteScenarios(id_scenario: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id_scenario}`);
  }

  updateScenarios(id_scenario : number,scenario: Scenario): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id_scenario }`,scenario);
  }

  CreateScenarios(scenario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/CreateScenario`, scenario);
  }
  getScenarioAttributes(scenarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${scenarioId}/attributes`);
  }
  getApproversByScenarioId(scenarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${scenarioId}/approvers`);
  }
}
