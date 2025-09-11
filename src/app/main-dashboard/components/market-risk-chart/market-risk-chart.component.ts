  import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
  import * as d3 from 'd3';
  import { RiskProfitloss } from '../../enums/riskProfitLoss.enum';

  @Component({
    selector: 'app-market-risk-chart',
    templateUrl: './market-risk-chart.component.html',
    styleUrls: ['./market-risk-chart.component.scss']
  })
  export class MarketRiskChartComponent implements OnInit {
    @Input('marketRisk') marketRisks: any;
    @Input() defaultRisk: any = 7;
    RiskProfitloss = RiskProfitloss;
    needleData: any;
    constructor() { }

    ngOnInit() {
      if (!this.defaultRisk) {
        this.defaultRisk = 7;
      }
      this.getData(this.defaultRisk)
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['defaultRisk']) {
        this.getData(this.defaultRisk);
      }
    }

    getData(marketRisk: any) {
      this.marketRisks = marketRisk
      d3.select(".risk-chart svg").remove();
      switch (marketRisk) {
        case 1:
          this.needleData = {
            data: 6,
            xValue: -3,
            color: '#45AE4A'
          };
          break;
        case 2:
          this.needleData = {
            data: 21,
            xValue: -3,
            color: '#29CC6A'
          };
          break;
        case 3:
          this.needleData = {
            data: 36,
            xValue: -3,
            color: '#7DDCA3'
          };
          break;
        case 4:
          this.needleData = {
            data: 51,
            xValue: -3,
            color: '#F9DE81'
          };
          break;
        case 5:
          this.needleData = {
            data: 64,
            xValue: 3,
            color: '#F7C30D'
          };
          break;
        case 6:
          this.needleData = {
            data: 79,
            xValue: 3,
            color: '#E83636'
          };
          break;
        case 7:
          this.needleData = {
            data: 94,
            xValue: 3,
            color: '#FF0000'
          };
          break;
        default:
          this.needleData = {
            data: 0,
            xValue: 0,
          }
      }

      var width = 202;
      var height = 100;

      var svg = d3.select("#g1")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr('viewBox', (100) + ' ' + (105) + ' ' + width + ' ' + height)

      var arc: any = d3.arc()
        .innerRadius(90)
        .outerRadius(80)
        .cornerRadius(5)
        .padAngle(0);

      var scale = d3.scaleLinear().domain([100, 0]).range([0, 180]);

      var colors: any = ["#45AE4A", "#29CC6A", "#7DDCA3", "#F9DE81", "#F7C30D", "#E83636", "#FF0000"];

      var pie = d3.pie()
        .startAngle((-1 * Math.PI) / 2)
        .endAngle(Math.PI / 2)
        .value(function (d) {
          return 30 / colors.length;
        });

      var arcs = svg.selectAll('.arc')
        .data(pie(colors))
        .enter()
        .append('path')
        .attr("d", arc)
        .attr("transform", "translate(200,200)")
        .attr("stroke", "white")
        .attr("stoke-width", "5px")
        .style("fill", function (d, i) {
          return colors[i];
        });

      var riskType = document.getElementById("riskType");
      if (riskType) {
        riskType.style.color = this.needleData?.color;
      }

      var needle = svg.selectAll(".needle")
        .data([this.needleData?.data])
        .enter()
        .append('circle')
        .attr("cx", this.needleData?.xValue)
        .attr("cy", -5)
        .attr("r", 10)
        .classed("needle", true)
        .style("fill", this.needleData?.color)
        .style("stroke", "rgba(255,192,203,.6)")
        .style("stroke-width", 4)
        .attr("transform", function (d) {
          var angle = scale(d);
          var x = Math.cos(angle * Math.PI / 180) * 80;
          var y = Math.sin(angle * Math.PI / 180) * -80;
          return "translate(200,200) translate(" + x + "," + y + ")";
        });

      var gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "00%")
        .attr("spreadMethod", "pad");
    }
  }
