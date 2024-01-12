import { Component, OnInit } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';

@Component({
  templateUrl: './employee-pie-chart.component.html',
  styleUrls: ['./employee-pie-chart.component.css'],
})
export class EmployeePieChartComponent implements OnInit {
  pieChart: any;

  constructor() { }

  ngOnInit(): void {
    // Initialize both the pie chart and the bar chart
    this.initPieChart();
    this.initBarChart();
  }

  initPieChart() {
    // Sample data for the pie chart
    const data = [30, 50, 20, 80, 90];

    // Pie chart configuration
    const config = {
      type: 'pie' as ChartType,
      data: {
        labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'],
        datasets: [
          {
            data: data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#F34E33', '#F4CT26'],
          },
        ],
      },
    };

    // Get the pie chart context
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    this.pieChart = new Chart(ctx, config);
  }

  initBarChart() {
    // Bar chart configuration
    const data = [10, 20, 30, 40, 50];
    const config = {
      type: 'bar' as ChartType,
      data: {
        labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'],
        datasets: [
          {
            data: data,
            backgroundColor: '#36A255',
          },
        ],
      },
    };

    // Get the bar chart context
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    const barChart = new Chart(ctx, config);
  }
}
