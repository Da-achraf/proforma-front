import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API_URL_TOKEN } from '../core/api/api.config';

@Injectable({
  providedIn: 'root',
})
export class KpiService {
  private url = inject(API_URL_TOKEN);
  private baseUrl = `${this.url}/kPIs`;

  constructor(private http: HttpClient) {
    console.log('hello api: ', this.baseUrl);
  }

  getRequestCountByAllScenarios(): Observable<{ [key: number]: number }> {
    return this.http.get<{ [key: number]: number }>(`${this.baseUrl}/requests-by-all-scenarios`);
    return of({
      'Domestics Intraco': 5,
      'My Scenario': 1,
      'Global Export': 8,
      'Local Distribution': 3,
      'Retail Supply Chain': 12,
      'E-Commerce Fulfillment': 7,
      'Wholesale Transactions': 4,
      'Manufacturing Orders': 9,
      'Customs Clearance': 2,
      'B2B Logistics': 6,
      'Direct-to-Consumer': 10,
      'Automotive Supply': 3,
      'Pharmaceutical Compliance': 11,
      'Tech Import-Export': 5,
      'Raw Material Procurement': 7,
      'International Trade': 14,
      'Aerospace Logistics': 6,
      'Energy Sector Supply': 4,
      'Fashion Retail Distribution': 8,
      'Food & Beverage Supply Chain': 13,
      'Heavy Machinery Orders': 5,
      'Luxury Goods Import': 2,
      'Medical Equipment Shipping': 9,
      'Agricultural Exports': 7,
      'Oil & Gas Logistics': 11,
      'Textile Manufacturing': 3,
      'Automated Warehousing': 6,
      'Fast-Moving Consumer Goods': 10,
      'High-Tech Components Supply': 8,
      'Industrial Equipment Procurement': 5,
      'Construction Materials Delivery': 7,
      'Electronics Retail Supply': 12,
      'Biotech Research Supply Chain': 4,
      'Telecom Infrastructure Logistics': 6,
      'Vehicle Parts Distribution': 9,
      'Defense Sector Procurement': 3,
      'Renewable Energy Imports': 7,
    });
  }

  getAllRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all-requests`);
  }

  getRequestCountByCostCenterPerScenario(): Observable<{
    [key: string]: { [key: number]: number };
  }> {
    return this.http.get<{ [key: string]: { [key: number]: number } }>(
      `${this.baseUrl}/requests-by-costcenter-per-scenario`,
    );
  }
  getRequestCountByCostCenterPerDay(): Observable<{
    [key: string]: { [key: string]: number };
  }> {
    return this.http.get<{ [key: string]: { [key: string]: number } }>(
      `${this.baseUrl}/requests-by-costcenter-per-day`,
    );
  }
  getAverageFlowTimeForAllRequests(): Observable<{ [key: number]: number }> {
    return this.http.get<{ [key: number]: number }>(
      `${this.baseUrl}/average-flow-time-all-requests`,
    );
  }
}
