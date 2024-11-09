import { Component, OnInit } from '@angular/core';
import { KpiService } from '../../services/KpiService';
import { ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { registerables, Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  public scenarioChartData!: ChartData<'bar'>;
  public scenarioChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return Number.isInteger(value) ? value : null;
          }
        },
        title: {
          display: true,
          text: 'Request Count'
        }
      }
    }
  };

  public costCenterChartData!: ChartData<'bar'>;
  public costCenterChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          precision: 0,
          stepSize: 1
        },
        title: {
          display: true,
          text: 'Request Count'
        }
      }
    }
  };

  public costCenterPerDayChartData!: ChartData<'line'>;
  public costCenterPerDayChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'yyyy-MM-dd'
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        ticks: {
          precision: 0, // Affiche uniquement les entiers
          stepSize: 1   // Incréments de 1
        },
        title: {
          display: true,
          text: 'Request Count'
        }
      }
    }
  };

  public averageFlowTimes!: { [key: number]: number };
  public averageFlowTimeChartData!: ChartData<'bar'>;
  public averageFlowTimeChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Time in Minutes'
        }
      }
    }
  };

  public scenarioCount: number = 0;
  public costCenterCount: number = 0;
  public costCenterPerDayCount: number = 0;
  public averageFlowTime: string = '0.000';

  constructor(private kpiService: KpiService) { }

  ngOnInit(): void {
    this.loadScenarioData();
    this.loadCostCenterData();
    this.loadCostCenterPerDayData();
    this.loadAverageFlowTimeForAllRequests();
  }

  loadScenarioData(): void {
    this.kpiService.getRequestCountByAllScenarios().subscribe(data => {
      const labels = Object.keys(data);
      const counts = Object.values(data);
      this.scenarioCount = counts.reduce((a, b) => a + b, 0);

      this.scenarioChartData = {
        labels: labels,
        datasets: [
          {
            label: 'Requests by Scenario',
            data: counts,
            backgroundColor: '#42A5F5'
          }
        ]
      };
    });
  }

  loadCostCenterData(): void {
    this.kpiService.getRequestCountByCostCenterPerScenario().subscribe(data => {
      const labels: string[] = Object.keys(data);
      const datasets: { label: string; data: number[]; backgroundColor: string }[] = [];

      let scenarioLabels: string[] = [];

      Object.keys(data).forEach(costCenter => {
        const scenarioData = data[costCenter];
        const dataPoints: number[] = [];

        scenarioLabels = Object.keys(scenarioData).map(scenarioId => `Scenario ${scenarioId}`);
        Object.keys(scenarioData).forEach(scenarioId => {
          const scenarioIdNum = Number(scenarioId);
          dataPoints.push(scenarioData[scenarioIdNum]);
        });

        datasets.push({
          label: `Cost Center: ${costCenter}`,
          data: dataPoints,
          backgroundColor: this.getRandomColor()
        });
      });

      this.costCenterCount = datasets.reduce((acc, dataset) => acc + dataset.data.reduce((a, b) => a + b, 0), 0);

      this.costCenterChartData = {
        labels: scenarioLabels,
        datasets: datasets
      };
    });
  }

  loadCostCenterPerDayData(): void {
    this.kpiService.getRequestCountByCostCenterPerDay().subscribe(data => {
      const datesSet = new Set<string>();
      const datasets: { label: string; data: { x: Date, y: number }[]; borderColor: string; fill: boolean }[] = [];

      Object.keys(data).forEach(costCenter => {
        const dateCounts = data[costCenter];
        const dataPoints: { x: Date, y: number }[] = [];

        Object.keys(dateCounts).forEach(date => {
          datesSet.add(date);
          dataPoints.push({ x: new Date(date), y: dateCounts[date] });
        });

        datasets.push({
          label: `Cost Center: ${costCenter}`,
          data: dataPoints,
          fill: false,
          borderColor: this.getRandomColor()
        });
      });

      const datesArray = Array.from(datesSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      this.costCenterPerDayChartData = {
        labels: datesArray.map(date => new Date(date)),
        datasets: datasets.map(dataset => ({
          ...dataset,
          data: dataset.data.map(point => ({
            x: point.x.getTime(),  // Convert Date to timestamp
            y: point.y
          }))
        }))
      };
    });
  }

  loadAverageFlowTimeForAllRequests(): void {
    this.kpiService.getAverageFlowTimeForAllRequests().subscribe(data => {
      this.averageFlowTimes = data;
      const labels = Object.keys(data).map(key => `Request ${key}`);
      const counts = Object.values(data);

      const totalFlowTime = counts.reduce((a, b) => a + b, 0);
      const averageFlowTime = (totalFlowTime / counts.length) || 0; // Calculate average flow time

      this.averageFlowTime = averageFlowTime.toFixed(3); // Format to three decimal places

      this.averageFlowTimeChartData = {
        labels: labels,
        datasets: [
          {
            label: 'Average Flow Time per Request (in Minutes)',
            data: counts,
            backgroundColor: '#FF6384'
          }
        ]
      };
    });
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
