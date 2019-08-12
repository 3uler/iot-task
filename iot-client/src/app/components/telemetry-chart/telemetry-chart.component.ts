import { ChartService } from './../../services/chart.service';
import { Component, OnInit, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

am4core.useTheme(am4themes_animated);

interface ChartOptions {
  index: number;
  label: string;
}

interface ChartData {
  date: Date;
  value: number;
}

@Component({
  selector: 'app-telemetry-chart',
  templateUrl: './telemetry-chart.component.html',
  styleUrls: ['./telemetry-chart.component.scss']
})
export class TelemetryChartComponent implements AfterViewInit, OnDestroy {

  private unsubscribeAll = new Subject();
  private chart: am4charts.XYChart;
  private data: ChartData[] = [];
  chartOptions: ChartOptions[] = [];
  selected = 0;

  constructor(private chartService: ChartService, private zone: NgZone) {
    for (let i = 0; i < 5; i++) {
      this.chartOptions.push({ index: i, label: 'Sin-' + i });
    }
  }

  onSelectionChanged(): void {
    this.chart.data = [];
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const chart = am4core.create('chartdiv', am4charts.XYChart);

      chart.paddingRight = 20;


      chart.data = this.data;

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;

      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = 'date';
      series.dataFields.valueY = 'value';

      series.tooltipText = '{valueY.value}';
      chart.cursor = new am4charts.XYCursor();

      const scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      this.chart = chart;
    });

    this.chartService.dataStream.pipe(takeUntil(this.unsubscribeAll)).subscribe((streamData) => {
      const chartData: ChartData[] = streamData.map((data) => {
        return {
          date: new Date(data.timestamp),
          value: data.movingAverages[this.selected]
        };
      });
      if (this.chart.data.length < 200) {
        this.chart.addData(chartData);
      } else {
        this.chart.addData(chartData, chartData.length);
      }
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

}
