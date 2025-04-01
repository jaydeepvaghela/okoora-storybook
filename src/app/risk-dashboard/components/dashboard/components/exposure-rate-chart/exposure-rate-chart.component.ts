import { ChangeDetectorRef, Component, OnInit, AfterViewInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexLegend,
  ApexTooltip,
  ApexFill,
  ApexPlotOptions,
  ApexAnnotations,
  NgApexchartsModule
} from "ng-apexcharts";
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-exposure-rate-chart',
  imports: [CommonModule, NgApexchartsModule, MatPaginatorModule, MatSelectModule, MatChipsModule],
  templateUrl: './exposure-rate-chart.component.html',
  styleUrl: './exposure-rate-chart.component.scss',
})
export class ExposureRateChartComponent implements OnInit, AfterViewInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public chartSeries!: ApexAxisChartSeries;
  public originalSeries!: ApexAxisChartSeries;
  public selectedRates: string[] = ['Spot'];
  public chartOptions!: ApexChart;
  public xAxisOptions!: ApexXAxis;
  public yAxisOptions!: ApexYAxis;
  public strokeOptions!: ApexStroke;
  public dataLabelsOptions!: ApexDataLabels;
  public legendOptions!: ApexLegend;
  public tooltipOptions!: ApexTooltip;
  public plotOptions!: ApexPlotOptions;
  public markersOptions!: ApexMarkers;
  public fillOptions!: ApexFill;
  public annotations!: ApexAnnotations;
  monthChartXAxixData: any;
  cashFlowTableData: any;
  resizeSubscription: Subscription | undefined;
  monthlyExposure: any = [25,10,15,18,20,16,14,12,8,17,13,10];
  ourRecommendedHedge: any = [10.50,8.5,6.3,5.5,2.5,8.3,4.6,3.8,4.9,7.5,3.6,2.3];
  liabilityRate: any = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0];
  spotRate: any = [4.2110,4.2110,4.2110,4.2110,4.2110,4.2110,4.2110,4.2110,4.2110,4.2110,4.2110,4.2110];
  hedgeRate: any = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0];
  currentHedge: any = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0];
  budgetRate: any = [4.0712,4.0712,4.0712,4.0712,4.0712,4.0712,4.0712,4.0712,4.0712,4.0712,4.0712,4.0712];
  constructor(
    private cdr: ChangeDetectorRef,
  ) { }
  paginatedSeries: any = [];
  pageSize = 12;
  currentPage = 0;
  completedAdvancePolicy: boolean = true;
  ngOnInit() {
    setTimeout(() => {
      this.initializeChart();
      this.setupResizeListener();
      this.updatePaginatedSeries();
    }, 100);
  }
  updatePaginatedSeries() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedSeries = this.chartSeries.map(series => ({
      ...series,
      data: series?.data?.slice(startIndex, endIndex)
    }));
    this.xAxisOptions = {
      categories: this.monthChartXAxixData?.slice(startIndex, endIndex),
    };
  }
  ngAfterViewInit() {
    this.initializeChart();
    this.paginator?.page?.subscribe((event: PageEvent) => this.onPageChange(event));
    this.updatePaginatedSeries();
  }
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedSeries();
    this.handleWindowResize();
  }

  setupResizeListener() {
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.handleWindowResize());
  }

  handleWindowResize() {
    setTimeout(() => {
      this.setMarkerStrokeColors();
    }, 0);
  }

  setMarkerStrokeColors() {
    const colors: { [key: string]: string } = {
      'Hedged': '#05F2F2',
      'Liability': '#2C4CF5',
      'Spot': '#F9AE67',
      'Budget': '#8BDDF4'
    };

    document.querySelectorAll('.apexcharts-series').forEach(seriesElement => {
      const seriesName = seriesElement.getAttribute('seriesName');
      if (seriesName && colors[seriesName]) {
        const strokeColor = colors[seriesName];

        // Set marker stroke colors
        const markersWrap = seriesElement.querySelector('.apexcharts-series-markers-wrap');
        if (markersWrap) {
          const markers = markersWrap.querySelectorAll('.apexcharts-marker');
          markers.forEach(marker => {
            marker.setAttribute('stroke', strokeColor);
          });
        }

        // Set line stroke colors
        const lineElement = seriesElement.querySelector('.apexcharts-line');
        if (lineElement) {
          lineElement.setAttribute('stroke', strokeColor);

          if (seriesName === 'Spot') {
            lineElement.setAttribute('stroke-dasharray', '6');
          }
        }
      }
    });
  }

  initializeChart() {
    this.monthChartXAxixData = ['Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24', 'Jun 24', 'Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24'];

    this.originalSeries = this.generateSeriesData(this.monthChartXAxixData.length);
    const spotRateLine = this.spotRate;
    const currentSpotRate = spotRateLine[spotRateLine.length - 1];
    const yAxisMax = currentSpotRate * 1.60;

    this.chartOptions = {
      type: "line",
      height: 302,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
        tools: {
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false
        }
      }
    };

    this.xAxisOptions = {
      categories: this.monthChartXAxixData,
      labels: {
        style: {
          cssClass: 'apexcharts-xaxis-label'
        }
      }
    };

    const lineColors = this.getLineColors();
    this.yAxisOptions = {
      min: 0,
      max: yAxisMax,
      tickAmount: 6,
      labels: {
        formatter: function (value: number) {
          return value.toFixed(2);
        }
      }
    };

    this.strokeOptions = { width: [3, 3, 3], colors: lineColors, curve: "straight", dashArray: [0, 0, 5] };
    this.dataLabelsOptions = { enabled: false };
    this.legendOptions = { show: false, position: "top" };
    this.tooltipOptions = { enabled: true };
    this.plotOptions = { bar: { horizontal: false, borderRadius: 0, rangeBarOverlap: false } };
    this.markersOptions = { size: 4, colors: ["#fff"], strokeColors: lineColors, strokeWidth: 2, strokeOpacity: 1 };
    this.fillOptions = { colors: ["#D8E9FD", "#A9B5F9", "#2947F2"], opacity: [0.2, 0.2, 0.2] };

    this.updateChart();
  }


  generateSeriesData(monthsCount: number): ApexAxisChartSeries {
    // Destructure Liability, spot, and hedgeRate for each month
    const liabilityLine = this.liabilityRate;
    const spotRateLine = this.spotRate;
    const hedgeRateLine = this.hedgeRate;
    const budgetRateLine = this.budgetRate;

    const exposureBar = this.monthlyExposure;
    const recommendedHedgeBar = this.ourRecommendedHedge;
    const currentHedgeBar = this.currentHedge;
    const chartData = [
      {
        name: "Hedged",
        type: "line",
        data: hedgeRateLine
      },
      {
        name: "Liability",
        type: "line",
        data: liabilityLine
      },
      {
        name: "Spot",
        type: "line",
        data: spotRateLine
      },
      {
        name: "Budget",
        type: "line",
        data: budgetRateLine
      },
      {
        name: "Exposure",
        type: "bar",
        data: exposureBar
      },
      {
        name: "Recommended hedging",
        type: "bar",
        data: recommendedHedgeBar
      },
      {
        name: "Actual hedging",
        type: "bar",
        data: currentHedgeBar
      }
    ];

    return chartData;
  }

  getRandomValue(min: number, max: number): number {
    return +(Math.random() * (max - min) + min).toFixed(2);
  }

  setAtLeastTwoZeroes(dataArray: number[]): void {
    const zeroIndices: number[] = [];
    while (zeroIndices.length < 2) {
      const index = Math.floor(Math.random() * dataArray.length);
      if (!zeroIndices.includes(index)) {
        zeroIndices.push(index);
      }
    }
    zeroIndices.forEach(index => dataArray[index] = 0);
  }

  onRateChange(event: any) {
    const selectedRate = event.value;
    if (!this.selectedRates.includes(selectedRate)) {
      this.selectedRates.push(selectedRate);
    }
    this.updateChart();
    this.updatePaginatedSeries();
  }

  onChipRemove(chipLabel: string) {
    this.selectedRates = this.selectedRates.filter(rate => rate !== chipLabel);
    if (this.selectedRates.length === 0) {
      this.selectedRates = [];
    }
    this.updateChart();
    this.updatePaginatedSeries();
  }

  updateChart() {
    const barSeries = this.originalSeries.filter(series => series.type === 'bar');
    const lineSeries = this.originalSeries.filter(series =>
      series.type === 'line' && (series.name && this.selectedRates.includes(series.name))
    );

    this.plotOptions = {
      bar: {
        horizontal: false,
        borderRadius: 0,
        distributed: false,
      }
    };
    this.chartSeries = [...barSeries, ...lineSeries];

    const lineColors = this.getLineColors();

    this.strokeOptions = {
      width: lineSeries.map(() => 4),
      colors: lineColors,
      curve: "straight",
      dashArray: [0, 0, 5]
    };

    this.markersOptions = {
      size: 4,
      colors: ["#fff"], // Marker fill color
      strokeColors: lineColors, // Marker border color
      strokeWidth: 2,
      strokeOpacity: 1
    };
    this.updateAnnotations();
    this.cdr.detectChanges();

    setTimeout(() => {
      this.setMarkerStrokeColors();
    }, 0);
  }

  getLineColors(): string[] {
    const colors: { [key: string]: string } = {
      'Hedged': '#05F2F2',
      'Liability': '#2C4CF5',
      'Spot': '#F9AE67',
      'Budget': '#8BDDF4'
    };

    return this.selectedRates.map(rate => colors[rate] || '#000');
  }

  updateAnnotations() {
    const visibleLineSeries = this.chartSeries.filter(series => series.type === 'line');

    const isSmallScreen = window.innerWidth <= 1440;
    const fontSize = isSmallScreen ? '12px' : '14px';
    const padding = isSmallScreen ? { top: 5, bottom: 5, left: 5, right: 5 } : { top: 10, bottom: 10, left: 10, right: 10 };

    this.annotations = {
      points: visibleLineSeries.map(series => {
        const lastDataPointIndex = series.data.length - 1;
        const lastDataPoint = Number(series.data[lastDataPointIndex]).toFixed(4);;
        const seriesName = series.name;
        let strokeColor = '';
        let labelBackground = '';
        let labelColor = '';

        if (seriesName === 'Hedged') {
          strokeColor = '#05F2F2';
          labelBackground = '#05F2F2';
          labelColor = '#2947F2';
        } else if (seriesName === 'Liability') {
          strokeColor = '#2C4CF5';
          labelBackground = '#2C4CF5';
          labelColor = '#FFFFFF';
        } else if (seriesName === 'Spot') {
          strokeColor = '#F9AE67';
          labelBackground = '#FDE5CE';
          labelColor = '#C46408';
        } else if (seriesName === 'Budget') {
          strokeColor = '#8BDDF4';
          labelBackground = '#8BDDF4';
          labelColor = '#2C2C2C';
        }

        return {
          x: this.monthChartXAxixData[lastDataPointIndex],
          y: Number(lastDataPoint),
          marker: { size: 4, fillColor: '#fff', strokeColor: strokeColor, radius: 2 },
          label: {
            text: `${lastDataPoint}`,
            borderColor: strokeColor,
            offsetY: -10,
            style: {
              background: labelBackground,
              color: labelColor,
              fontSize: fontSize,
              padding: padding,
              fontFamily: 'Heebo'
            },
          }
        };
      })
    };
  }

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
}
