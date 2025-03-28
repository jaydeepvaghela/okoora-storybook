import { CommonModule } from "@angular/common";
import { Component, ViewChild, AfterViewInit, OnInit, Input } from "@angular/core";
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
  chartValue: number = 0;
  @Input() currencyPair: string = 'USD/EUR';
  @Input() riskdirection: number = 1;
  @Input() momentumRankScore: number = 2;
  momentumRank: string = ''

  constructor() {
    this.getChartOptions();
  }

  getChartOptions() {
    this.chartOptions = {
      series: [100], // Static value
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
    const momentumRankScoreMap: { [key: number]: number } = {
      0: 100,
      1: 75,
      2: 35,
      3: 20
    };
    this.momentumRank = this.getMomentumRank();
    const updateChart = (momentumRankScore: any) => {
      this.chartOptions.series = [0];
      this.chartValue = momentumRankScoreMap[momentumRankScore] ?? 0;
      this.updateSeries([this.chartValue]);
    };
    if (this.riskdirection === 1 || this.riskdirection === 2) {
      switch (this.momentumRankScore) {
        case 3:
        case 2:
        case 1:
        case 0:
          updateChart(this.momentumRankScore);
          break;
        default:
          console.error("Invalid momentumRankScore");
      }
    }
  }

  getMomentumRank(){
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

    const updateIndicatorArrow = (fillColor: any, strokeColor: any) => {
      const indicatorArrow = document.getElementById("m-indicator-arrow");
      if (indicatorArrow) {
        const path = indicatorArrow.querySelector("path");
        if (path) {
          path.style.stroke = strokeColor;
          path.style.fill = fillColor;
        }
      } else {
        console.error("Element with ID 'm-indicator-arrow' not found.");
      }
    };
    const updateChartOptions = (color: any) => {
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
    };
    const handleRiskDirection = (riskDirection: any, momentumRankScore: any) => {
      let fillColor, strokeColor;

      if (riskDirection === 1) {
        fillColor = strokeColor = (momentumRankScore === 3 || momentumRankScore === 2) ? "#11AF1C" : "#EE0B0B";
      } else if (riskDirection === 2) {
        fillColor = strokeColor = (momentumRankScore === 3 || momentumRankScore === 2) ? "#EE0B0B" : "#11AF1C";
      } else {
        console.error("Invalid riskDirection");
        return;
      }

      updateIndicatorArrow(fillColor, strokeColor);
      updateChartOptions(fillColor);
    };
    if (this.riskdirection === 2 || this.riskdirection === 1) {
      switch (this.momentumRankScore) {
        case 3:
        case 2:
        case 1:
        case 0:
          handleRiskDirection(this.riskdirection, this.momentumRankScore);
          break;
        default:
          console.error("Invalid momentumRankScore");
      }
    }
    if (this.chartValue > 20) {
      this.updateArrowRotation();
    }
  }
}
