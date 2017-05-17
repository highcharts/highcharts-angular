import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <p>Data set (0,1 or 2): </p>
  <input [(ngModel)]="usedIndex"><br/>

  <p>Chart title text: </p>
  <input 
    [(ngModel)]="charts[usedIndex].hcOptions.title.text"
    (ngModelChange)="titleChange($event)"
  >

  <p>The title should be as: {{ charts[usedIndex].hcOptions.title.text }}</p>
  <app-chart [hcChart]="charts[usedIndex]"></app-chart>
  `
})

export class AppComponent {
  // starting value
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
    this.charts[this.usedIndex].update = true;
  }

  charts = [
    {
    	hcConstructor: 'chart',
    	hcOptions: {
        chart: {renderTo:'firstChart'},
        title: { text: this.chartTitle },
        subtitle: { text: 'Highcharts chart' },
        series: [{ type: 'line', data: [11,2,3] }, { data: [5,6,7] }]
      },
    	hcCallback: function(chart) { console.log(chart) }
    },
    {
    	hcOptions: {
        chart: {renderTo:'secondChart'},
        title: { text: this.chartTitle },
        subtitle: { text: 'Stock chart' },
        series: [{ type: 'ohlc', data: [[6,8,4,5], [6,9,5,8]] }, { data: [] }]
      }
    },
    {
    	hcOptions: {
        chart: {renderTo:'thirdChart'},
        title: { text: this.chartTitle },
        subtitle: { text: 'Could be a map chart' },
        series: [{ type: 'scatter', data: [1,2,3,4,5] }, { data: [] }]
      }
    }
  ];
}
