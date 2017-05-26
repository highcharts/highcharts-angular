declare var require: any

import { Component } from '@angular/core';

import * as Highcharts from 'highcharts';
require('highcharts/modules/map')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  // For all demos:
  Highcharts = Highcharts;

  // Demo #1
  optFromInputString = `
  {
    "subtitle": { "text": "Highcharts chart" },
    "series": [{
      "type": "line",
      "data": [11,2,3]
    }, {
      "data": [5,6,7]
    }]
  }
  `;

  optFromInput = JSON.parse(this.optFromInputString);
  updateFromInput = false;

  updateInputChart = function() {
    this.optFromInput = JSON.parse(this.optFromInputString);
  };

  seriesTypes = {
    line: 'column',
    column: 'scatter',
    scatter: 'spline',
    spline: 'line'
  };

  toggleSeriesType = function(index = 0) {
    this.optFromInput.series[index].type = this.seriesTypes[this.optFromInput.series[index].type];
    // nested change - must trigger update
    this.updateFromInput = true;
  };

  //----------------------------------------------------------------------
  // Demo #2

  // starting values
  updateDemo2 = false;
  usedIndex = 0;
  chartTitle = 'My chart'; // for init - change through titleChange

  // change in all places
  titleChange = function(event) {
    var v = event;
    this.chartTitle = v;
    this.charts.forEach((el) => {
      el.hcOptions.title.text = v;
    });
    // trigger ngOnChanges
    this.updateDemo2 = true;
  };

  charts = [
    {
    	hcConstructor: 'chart',
    	hcOptions: {
        title: { text: this.chartTitle },
        subtitle: { text: '1st chart' },
        series: [{ type: 'line', data: [11,2,3] }, { data: [5,6,7] }]
      },
    	hcCallback: function(chart) { console.log(Highcharts, chart); }
    },
    {
    	hcOptions: {
        title: { text: this.chartTitle },
        subtitle: { text: '2nd chart' },
        series: [{ type: 'column', data: [4,3,2,6] }, { data: [] }]
      }
    },
    {
    	hcOptions: {
        title: { text: this.chartTitle },
        subtitle: { text: '3rd chart' },
        series: [{ type: 'scatter', data: [1,2,3,4,5] }, { data: [] }]
      }
    }
  ];
}
