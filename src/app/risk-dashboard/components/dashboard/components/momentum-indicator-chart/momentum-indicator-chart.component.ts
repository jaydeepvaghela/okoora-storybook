import { CommonModule } from "@angular/common";
import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ApexStroke,
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-momentum-indicator-chart',
   imports: [NgbTooltipModule, NgApexchartsModule, CommonModule],
   standalone: true,
  templateUrl: './momentum-indicator-chart.component.html',
  styleUrls: ['./momentum-indicator-chart.component.scss']
})
export class MomentumIndicatorChartComponent implements OnInit, AfterViewInit {
  @ViewChild("chart") chart!: ChartComponent;

  public chartOptions!: ChartOptions;
  chartValue: number = 75; // Static value
  currencyPair: string = 'USD/EUR'; // Static value
  riskdirection: number = 1; // Static value
  momentumRankScore: number = 2; // Static value
  momentumIndicatorRes = {
    momentumRank: 'Rise Significantly' // Default value
  };

  constructor() {
    this.getChartOptions();
  }

  getChartOptions() {
    // this.momentumIndicatorRes.momentumRank = 'Rise Moderately';
    this.chartOptions = {
      series: [75], // Static value
      chart: {
        height: 350,
        type: "radialBar",
        offsetY: 0
      },
      plotOptions: {
        radialBar: {
          startAngle: 0,
          endAngle: 180,
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          gradientToColors: ["#E4E7EC"],
          stops: [0, 100]
        },
        colors: ["#F9FAFB", "#E4E7EC"]
      },
      stroke: {
        dashArray: 4,
        width: 3,
        colors: ["#f9f9f9"]
      },
      labels: []
    };
  }

  ngOnInit(): void {
    this.updateSeries([this.chartValue]);
  }

  getMomentumRank(): string {
    if (this.riskdirection == 2) {
      switch (this.momentumRankScore) {
        case 0: return "Decline Significantly";
        case 1: return "Decline Moderately";
        case 2: return "Rise Moderately";
        case 3: return "Rise Significantly";
      }
    } else if (this.riskdirection == 1) {
      switch (this.momentumRankScore) {
        case 0: return "Decline Significantly";
        case 1: return "Decline Moderately";
        case 2: return "Rise Moderately";
        case 3: return "Rise Significantly";
      }
    }
    return "Not Found";
  }

  ngAfterViewInit() {
    if (this.chartValue > 10) {
      this.updateArrowRotation();
    }
  }

  updateArrowRotation() {
    const value = this.chartValue;
    const maxValue = 100;
    const rotation = (value / maxValue) * 180;

    const arrowElement = document.querySelector('.arrow-wrap') as HTMLElement;
    if (arrowElement) {
      arrowElement.style.transform = `rotate(${rotation}deg)`;
    }
  }

  updateSeries(series: ApexNonAxisChartSeries) {
    this.chartOptions.series = series;
    this.chart?.updateSeries(series);

    const fillColor = (this.momentumRankScore === 3 || this.momentumRankScore === 2) ? "#11AF1C" : "#EE0B0B";
    const strokeColor = fillColor;

    this.updateIndicatorArrow(fillColor, strokeColor);
    this.updateChartOptions(fillColor);

    if (this.chartValue > 20) {
      this.updateArrowRotation();
    }
  }

  updateIndicatorArrow(fillColor: string, strokeColor: string) {
    const indicatorArrow = document.getElementById("m-indicator-arrow");
    if (indicatorArrow) {
      const path = indicatorArrow.querySelector("path");
      if (path) {
        path.style.stroke = strokeColor;
        path.style.fill = fillColor;
      }
    }
  }

  updateChartOptions(color: string) {
    this.chartOptions.fill = {
      type: "gradient",
      gradient: {
        shade: "dark",
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        gradientToColors: [color],
        stops: [0, 50, 65, 91]
      },
      colors: [color, "#12B01C"]
    };
  }
}
