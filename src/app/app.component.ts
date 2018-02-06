declare var require: any

import { Component } from '@angular/core';

import * as Highcharts from 'highcharts/highstock';
import * as HC_map from 'highcharts/modules/map';
import * as HC_exporting from 'highcharts/modules/exporting';
import * as HC_ce from 'highcharts-custom-events';

HC_map(Highcharts);
require('../../js/worldmap')(Highcharts);

HC_exporting(Highcharts);
HC_ce(Highcharts);

Highcharts.setOptions({
  title: {
    style: {
      color: 'orange'
    }
  }
});

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

  charts = [{
  	hcOptions: {
      title: { text: this.chartTitle },
      subtitle: { text: '1st data set' },
      plotOptions: {
        series: {
           pointStart: Date.now(),
           pointInterval: 86400000 // 1 day
        }
      },
      series: [{
        type: 'line',
        data: [11, 2, 3],
        threshold: 5,
        negativeColor: 'red'
      }, {
        type: 'candlestick',
        data: [
          [0, 15, -6, 7],
          [7, 12, -1, 3],
          [3, 10, -3, 3]
        ]
      }]
    },
  	hcCallback: (chart) => { console.log('some variables: ', Highcharts, chart, this.charts); }
  }, {
  	hcOptions: {
      title: { text: this.chartTitle },
      subtitle: { text: '2nd data set' },
      series: [{
        type: 'column',
        data: [4, 3, -12],
        threshold: -10
      }, {
        type: 'ohlc',
        data: [
          [0, 15, -6, 7],
          [7, 12, -1, 3],
          [3, 10, -3, 3]
        ]
      }]
    },
    hcCallback: () => {}
  }, {
  	hcOptions: {
      title: { text: this.chartTitle },
      subtitle: { text: '3rd data set' },
      series: [{
        type: 'scatter',
        data: [1, 2, 3, 4, 5]
      }, {
        type: 'areaspline',
        data: [
          5,
          11,
          3,
          6,
          0
        ]
      }]
    },
    hcCallback: () => {}
  }];

  //----------------------------------------------------------------------
  // Demo #3

  chartMap = {
    chart: {
      map: 'myMapName'
    },
    title: {
      text: 'Highmaps basic demo'
    },
    subtitle: {
      text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world.js">World, Miller projection, medium resolution</a>'
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        alignTo: 'spacingBox'
      }
    },
    colorAxis: {
      min: 0
    },
    series: [{
      name: 'Random data',
      states: {
        hover: {
          color: '#BADA55'
        }
      },
      dataLabels: {
        enabled: true,
        format: '{point.name}'
      },
      allAreas: false,
      data: [
        ['fo', 0],
        ['um', 1],
        ['us', 2],
        ['jp', 3],
        ['sc', 4],
        ['in', 5],
        ['fr', 6],
        ['fm', 7],
        ['cn', 8],
        ['pt', 9],
        ['sw', 10],
        ['sh', 11],
        ['br', 12],
        ['ki', 13],
        ['ph', 14],
        ['mx', 15],
        ['es', 16],
        ['bu', 17],
        ['mv', 18],
        ['sp', 19],
        ['gb', 20],
        ['gr', 21],
        ['as', 22],
        ['dk', 23],
        ['gl', 24],
        ['gu', 25],
        ['mp', 26],
        ['pr', 27],
        ['vi', 28],
        ['ca', 29],
        ['st', 30],
        ['cv', 31],
        ['dm', 32],
        ['nl', 33],
        ['jm', 34],
        ['ws', 35],
        ['om', 36],
        ['vc', 37],
        ['tr', 38],
        ['bd', 39],
        ['lc', 40],
        ['nr', 41],
        ['no', 42],
        ['kn', 43],
        ['bh', 44],
        ['to', 45],
        ['fi', 46],
        ['id', 47],
        ['mu', 48],
        ['se', 49],
        ['tt', 50],
        ['my', 51],
        ['pa', 52],
        ['pw', 53],
        ['tv', 54],
        ['mh', 55],
        ['cl', 56],
        ['th', 57],
        ['gd', 58],
        ['ee', 59],
        ['ag', 60],
        ['tw', 61],
        ['bb', 62],
        ['it', 63],
        ['mt', 64],
        ['vu', 65],
        ['sg', 66],
        ['cy', 67],
        ['lk', 68],
        ['km', 69],
        ['fj', 70],
        ['ru', 71],
        ['va', 72],
        ['sm', 73],
        ['kz', 74],
        ['az', 75],
        ['tj', 76],
        ['ls', 77],
        ['uz', 78],
        ['ma', 79],
        ['co', 80],
        ['tl', 81],
        ['tz', 82],
        ['ar', 83],
        ['sa', 84],
        ['pk', 85],
        ['ye', 86],
        ['ae', 87],
        ['ke', 88],
        ['pe', 89],
        ['do', 90],
        ['ht', 91],
        ['pg', 92],
        ['ao', 93],
        ['kh', 94],
        ['vn', 95],
        ['mz', 96],
        ['cr', 97],
        ['bj', 98],
        ['ng', 99],
        ['ir', 100],
        ['sv', 101],
        ['sl', 102],
        ['gw', 103],
        ['hr', 104],
        ['bz', 105],
        ['za', 106],
        ['cf', 107],
        ['sd', 108],
        ['cd', 109],
        ['kw', 110],
        ['de', 111],
        ['be', 112],
        ['ie', 113],
        ['kp', 114],
        ['kr', 115],
        ['gy', 116],
        ['hn', 117],
        ['mm', 118],
        ['ga', 119],
        ['gq', 120],
        ['ni', 121],
        ['lv', 122],
        ['ug', 123],
        ['mw', 124],
        ['am', 125],
        ['sx', 126],
        ['tm', 127],
        ['zm', 128],
        ['nc', 129],
        ['mr', 130],
        ['dz', 131],
        ['lt', 132],
        ['et', 133],
        ['er', 134],
        ['gh', 135],
        ['si', 136],
        ['gt', 137],
        ['ba', 138],
        ['jo', 139],
        ['sy', 140],
        ['mc', 141],
        ['al', 142],
        ['uy', 143],
        ['cnm', 144],
        ['mn', 145],
        ['rw', 146],
        ['so', 147],
        ['bo', 148],
        ['cm', 149],
        ['cg', 150],
        ['eh', 151],
        ['rs', 152],
        ['me', 153],
        ['tg', 154],
        ['la', 155],
        ['af', 156],
        ['ua', 157],
        ['sk', 158],
        ['jk', 159],
        ['bg', 160],
        ['qa', 161],
        ['li', 162],
        ['at', 163],
        ['sz', 164],
        ['hu', 165],
        ['ro', 166],
        ['ne', 167],
        ['lu', 168],
        ['ad', 169],
        ['ci', 170],
        ['lr', 171],
        ['bn', 172],
        ['iq', 173],
        ['ge', 174],
        ['gm', 175],
        ['ch', 176],
        ['td', 177],
        ['kv', 178],
        ['lb', 179],
        ['dj', 180],
        ['bi', 181],
        ['sr', 182],
        ['il', 183],
        ['ml', 184],
        ['sn', 185],
        ['gn', 186],
        ['zw', 187],
        ['pl', 188],
        ['mk', 189],
        ['py', 190],
        ['by', 191],
        ['cz', 192],
        ['bf', 193],
        ['na', 194],
        ['ly', 195],
        ['tn', 196],
        ['bt', 197],
        ['md', 198],
        ['ss', 199],
        ['bw', 200],
        ['bs', 201],
        ['nz', 202],
        ['cu', 203],
        ['ec', 204],
        ['au', 205],
        ['ve', 206],
        ['sb', 207],
        ['mg', 208],
        ['is', 209],
        ['eg', 210],
        ['kg', 211],
        ['np', 212]
      ]
    }]
  }
}
