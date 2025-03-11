import { Component, OnInit } from '@angular/core';
import { KpiService } from '../../services/KpiService';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // Scenario Chart
  scenarioChartOptions!: EChartsOption;
  costCenterChartOptions!: EChartsOption;
  costCenterPerDayChartOptions!: EChartsOption;
  averageFlowTimeChartOptions!: EChartsOption;

  // Metrics
  scenarioCount: number = 0;
  costCenterCount: number = 0;
  averageFlowTime: string = '0.000';

  constructor(private kpiService: KpiService) {}

  ngOnInit(): void {
    this.loadScenarioData();
    this.loadCostCenterData();
    this.loadCostCenterPerDayData();
    this.loadAverageFlowTimeForAllRequests();
  }

  loadScenarioData(): void {
    this.kpiService.getRequestCountByAllScenarios().subscribe((data) => {
      const labels = Object.keys(data);
      const counts = Object.values(data);
      this.scenarioCount = counts.reduce((a, b) => a + b, 0);

      this.scenarioChartOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        xAxis: {
          type: 'category',
          data: labels,
          axisLabel: { rotate: 45 },
        },
        yAxis: { type: 'value' },
        series: [
          {
            data: counts,
            type: 'bar',
            itemStyle: { color: '#42A5F5' },
            name: 'Requests',
          },
        ],
        grid: { containLabel: true },
      };
    });
  }

  loadCostCenterData(): void {
    this.kpiService
      .getRequestCountByCostCenterPerScenario()
      .subscribe(
        (data: { [costCenter: string]: { [scenarioId: string]: number } }) => {
          const costCenters = Object.keys(data);

          // Get unique scenario IDs with proper typing
          const scenarios = Array.from(
            new Set<string>(costCenters.flatMap((cc) => Object.keys(data[cc]))),
          ).map((s) => `Scenario ${s}`);

          const series = costCenters.map((cc) => ({
            name: `Cost Center ${cc}`,
            type: 'bar' as const, // Use const assertion
            data: scenarios.map((s) => {
              const scenarioId = s.split(' ')[1]; // scenarioId is now a string
              return data[cc][scenarioId] || 0; // Access with proper typing
            }),
            itemStyle: { color: this.getRandomColor() },
          }));

          this.costCenterChartOptions = {
            tooltip: { trigger: 'axis' },
            legend: { show: true, top: 'bottom' },
            xAxis: {
              type: 'category',
              data: scenarios as string[], // Explicit string array type
              axisLabel: { rotate: 45 },
            },
            yAxis: {
              type: 'value',
              name: 'Request Count',
            },
            series: series,
            grid: { containLabel: true },
          };
        },
      );
  }

  loadCostCenterPerDayData(): void {
    this.kpiService
      .getRequestCountByCostCenterPerDay()
      .subscribe(
        (data: { [costCenter: string]: { [date: string]: number } }) => {
          const costCenters = Object.keys(data);

          // Get unique dates with proper typing
          const dates = Array.from(
            new Set<string>(costCenters.flatMap((cc) => Object.keys(data[cc]))),
          ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

          const series = costCenters.map((cc) => ({
            name: `Cost Center ${cc}`,
            type: 'line' as const, // Use const assertion
            data: dates.map((date) => data[cc][date] || 0), // Safe access with fallback
            itemStyle: { color: this.getRandomColor() },
          }));

          this.costCenterPerDayChartOptions = {
            tooltip: { trigger: 'axis' },
            legend: { show: true, top: 'bottom' },
            xAxis: {
              type: 'category',
              data: dates as string[], // Explicit string array type
              axisLabel: { rotate: 45 },
            },
            yAxis: {
              type: 'value',
              name: 'Request Count', // Added axis title
            },
            series: series,
            grid: { containLabel: true },
          };
        },
      );
  }

  loadAverageFlowTimeForAllRequests(): void {
    this.kpiService.getAverageFlowTimeForAllRequests().subscribe((data) => {
      const requests = Object.keys(data);
      const values = Object.values(data);

      this.averageFlowTime = (
        values.reduce((a, b) => a + b, 0) / values.length
      ).toFixed(3);

      this.averageFlowTimeChartOptions = {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: requests,
          axisLabel: { rotate: 45 },
        },
        yAxis: {
          type: 'value',
          name: 'Minutes',
        },
        series: [
          {
            data: values,
            type: 'bar',
            itemStyle: { color: '#FF6384' },
          },
        ],
        grid: { containLabel: true },
      };
    });
  }

  getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
}
