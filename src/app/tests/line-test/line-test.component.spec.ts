import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHighCharts, HighchartsChartService } from '../../../../highcharts-angular/src/public_api';
import { LineTestComponent } from './line-test.component';


describe('LineTestComponent', () => {
  let component: LineTestComponent;
  let fixture: ComponentFixture<LineTestComponent>;
  let service: HighchartsChartService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LineTestComponent],
      providers: [provideHighCharts({})]
    })
    .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(LineTestComponent);
    service = TestBed.inject(HighchartsChartService);
    service.load();
    component = fixture.componentInstance;
    component.updateSeriesColor();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have data given from chartOptions', (done) => {
    const chartOptions = component.chartOptions;
    service.loaderChanges$.subscribe(loader => {
      const chart = loader.charts[loader.charts.length - 1];
      const series = chart.series[0];
      expect((series as any).yData).toEqual((chartOptions.series[0] as any).data);
      done();
    });
  });

  it('should be properly updated', (done) => {
    service.loaderChanges$.subscribe(loader => {
      const chart = loader.charts[loader.charts.length - 1];
      const series = chart.series[0] as unknown as Highcharts.Series;
      expect(series.color).toEqual('hotpink');
      done();
    });
  });
});
