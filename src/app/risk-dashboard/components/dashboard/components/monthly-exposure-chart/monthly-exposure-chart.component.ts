import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NgApexchartsModule } from "ng-apexcharts";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip,
  ApexPlotOptions,
  ApexFill
} from 'ng-apexcharts';
@Component({
  selector: 'app-monthly-exposure-chart',
  imports: [NgApexchartsModule, CommonModule, MatPaginatorModule],
  templateUrl: './monthly-exposure-chart.component.html',
  styleUrl: './monthly-exposure-chart.component.scss'
})
export class MonthlyExposureChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator, { read: ElementRef }) paginatorElementRef!: ElementRef;
  chart: any;
  tooltipIndex: number | null = null;
  monthChartXAxisData: any = [];
  constructor(private cdr: ChangeDetectorRef,
    private renderer: Renderer2, private el: ElementRef) { }
  public chartSeries!: ApexAxisChartSeries;
  public chartOptions!: ApexChart;
  public xAxisOptions!: ApexXAxis;
  public yAxisOptions!: ApexYAxis;
  public strokeOptions!: ApexStroke;
  public dataLabelsOptions!: ApexDataLabels;
  public legendOptions!: ApexLegend;
  public tooltipOptions!: ApexTooltip;
  public plotOptions!: ApexPlotOptions;
  public fillOptions!: ApexFill;

  columnIndex: any = [];
  paginatedSeries: any = [];
  pageSize = 12;
  currentPage = 0;
  ngOnInit() {
    this.chartSeries = [
      {
        name: "Exposure-negative",
        type: "bar",
        group: "exposer",
        data: [0, 0, 50000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      {
        name: "Exposure",
        type: "bar",
        group: "exposer",
        data: [95000, 95000, 45000, 95000, 95000, 95000, 95000, 95000, 95000, 95000, 95000, 95000, 95000, 95000, 95000, 95000, 95000, 95000, 95000, 95000, 95000, 95000, 95000, 95000]
      },
      {
        name: "Recommended hedging",
        type: "bar",
        group: "rechedge",
        data: [60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000]
      },
      {
        name: "Actual hedging",
        type: "bar",
        group: "acthedge",
        data: [1000, 1000, 1000, 20000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]
      }
    ];
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getChartOptions();
      this.updatePaginatedSeries();
    }, 100);
    if (this.paginator) {
      this.paginator?.page.subscribe((event: PageEvent) => this.onPageChange(event));
    }
  }
  ngAfterContentInit() {
    const checkPaginator = () => {
      if (this.paginatorElementRef) {
        const paginatorElement = this.paginatorElementRef.nativeElement;
        const previousButton = paginatorElement.querySelector('.mat-mdc-paginator-navigation-previous');
        const nextButton = paginatorElement.querySelector('.mat-mdc-paginator-navigation-next');

        if (previousButton && nextButton) {
          // Set the IDs for the buttons
          previousButton.setAttribute('id', 'previousButton');
          nextButton.setAttribute('id', 'nextButton');
          clearInterval(interval); // Stop the polling once IDs are set
        }
      }
    };

    // Poll every 100ms until the paginator is available
    const interval = setInterval(checkPaginator, 100);
  }
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedSeries();
  }
  ngOnDestroy() {
    // Destroy the chart to prevent memory leaks
    if (this.chart) {
      this.chart.destroy();
    }
  }
  getChartOptions() {
    this.chartOptions = {
      type: "bar",
      height: 319,
      stacked: true,
      toolbar: {
        show: false
      },
      events: {
        dataPointMouseEnter: (event, chartContext, config) => {
          this.tooltipIndex = config.dataPointIndex;
          this.showCustomTooltip(event, config);
        },
        dataPointMouseLeave: () => {
          setTimeout(() => this.hideCustomTooltip(), 1500000000);
        }
      }
    };

    this.xAxisOptions = {
      categories: ['Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24', 'Jun 24', 'Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24', 'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25'],
      labels: {
        style: {
          colors: '#98A2B3',
          fontSize: '12px',
          fontFamily: 'Inter'
        },
        rotate: -45,
        hideOverlappingLabels: false,
      },
    };
    this.monthChartXAxisData = this.xAxisOptions.categories;

    this.yAxisOptions = {
      min: 0,
      max: 100000, // Round off the value
      tickAmount: 5,
      labels: {
        formatter: function (val) {
          return "$" + val;
        },
        style: {
          colors: 'rgba(0, 0, 0, 0.70)',
          fontSize: '12px',
          fontFamily: 'Inter'
        }
      }
    };


    this.strokeOptions = {
      width: 0,
      curve: "smooth"
    };

    this.dataLabelsOptions = {
      enabled: false
    };

    this.legendOptions = {
      show: true,
      position: "top",
      markers: {
        offsetX: 0,
        offsetY: 0,
        fillColors: ["#D92D20", "#DCEAF7", "#A2B0FB", "#2947F2"],
        strokeWidth: 2
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0
      }
    };

    this.tooltipOptions = {
      enabled: false, // Disable default tooltips
    };

    this.plotOptions = {
      bar: {
        horizontal: false,
        columnWidth: '35px',
      }
    };

    this.fillOptions = {
      colors: ["#D92D20", "#DCEAF7", "#A2B0FB", "#2947F2"],
    };
  }
  updatePaginatedSeries() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    if (this.chartSeries) {
      this.paginatedSeries = this.chartSeries.map(series => ({
        ...series,
        data: series?.data?.slice(startIndex, endIndex)
      }));

      // Paginate the categories as well
      this.xAxisOptions = {
        categories: this.monthChartXAxisData?.slice(startIndex, endIndex),
      };
    }
  }
  showCustomTooltip(event: MouseEvent, config: any) {
    let tooltip = document.getElementById('custom-tooltip');

    if (tooltip) {
      // const { seriesIndex, dataPointIndex } = config;
      // const actualIndex = this.currentPage * this.pageSize + dataPointIndex;
      // const data = this.chartSeries[seriesIndex].data[actualIndex];
      // Adjust the tooltip content
      this.renderer.setProperty(tooltip, 'innerHTML', `
      <div class="inner-wrap">
        <div class="head-title">January 2024</div>
        <div class="item-wrap">
          <div class="tooltip-item">
            <div class="info-sec item-month">
              <h4 class="title">Monthly exposure</h4>
              <div class="amount"><span class="negative-value">-$10,000</span> / $100,000</div>
              <div class="neg-text">Reverse exposure</div>
            </div>
            <button class="edit-button">Edit</button>
          </div>
          <div class="tooltip-item">
            <div class="info-sec item-hedge">
              <h4 class="title">Recommended hedge</h4>
              <div class="amount">$60,000</div>
            </div>
          </div>
          <div class="tooltip-item">
            <div class="info-sec item-fund">
              <h4 class="title">Hedged funds</h4>
              <div class="amount">$0</div>
            </div>
            <button class="hedge-button">Hedge</button>
          </div>
        </div>
      </div>
    `);


      if (!document.body.contains(tooltip)) {
        this.renderer.appendChild(document.body, tooltip);
      }
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY / 2.5}px`;
      tooltip.style.display = 'block';

      this.cdr.detectChanges();

      // tooltip.addEventListener('click', (e: Event) => {
      //   const target = e.target as HTMLElement;
      //   if (target.classList.contains('edit-button')) {
      //     const index = target.getAttribute('data-index');
      //     if (index !== null) {
      //       this.editValue(parseInt(index, 10));
      //     }
      //   } else if (target.classList.contains('hedge-button')) {
      //     this.router.navigate([localStorage.getItem('subSite') ? localStorage.getItem('subSite') + 'risk-manager/hedging-proposal' : '/risk-manager/hedging-proposal']);
      //   }
      // });
    }
  }
  hideCustomTooltip() {
    const tooltip = document.getElementById('custom-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }
  @HostListener('document:mousemove', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.el.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.hideCustomTooltip();
    }
  }
  @HostListener('document:scroll', ['$event'])
  onDocumentScroll(event: Event): void {
    this.hideCustomTooltip();
  }
}
