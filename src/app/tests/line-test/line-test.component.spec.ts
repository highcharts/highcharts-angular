import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LineTestComponent } from './line-test.component';
import { HighchartsChartComponent } from '../../../../highcharts-angular/src/lib/highcharts-chart.component'


describe('LineTestComponent', () => {
  let component: LineTestComponent;
  let fixture: ComponentFixture<LineTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:      [ HighchartsChartComponent ],
      declarations: [ LineTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineTestComponent);
    component = fixture.componentInstance;
    component.updateSeriesColor();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have data given from chartOptions', () => {
    const chartOptions = component.chartOptions;
    const chart = component.Highcharts.charts[component.Highcharts.charts.length - 1];
    const series = chart.series[0] ;
    expect((series as any).yData).toEqual((chartOptions.series[0] as any).data);
  });

  it('should be properly updated', () => {
    const chart = component.Highcharts.charts[component.Highcharts.charts.length - 1];
    const series = chart.series[0] as unknown as Highcharts.Series;
    expect(series.color).toEqual('hotpink');
  });
});
