import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { LineTestComponent } from './line-test.component';
import { HighchartsChartModule } from '../../../../highcharts-angular/src/lib/highcharts-chart.module'


describe('LineTestComponent', () => {
  let component: LineTestComponent;
  let fixture: ComponentFixture<LineTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:      [ HighchartsChartModule ],
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
    const series = chart.series[0] as unknown as Highcharts.SeriesLineOptions;
    expect(series.color).toEqual('hotpink');
  });
});
