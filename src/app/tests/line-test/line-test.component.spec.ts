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

  it('should have data given from chartOptions', () => {
    const chartOptions = component.chartOptions;
    const series = component.chartInstance.series[0];
    expect((series as any).yData).toEqual((chartOptions.series[0] as any).data);
  });

  it('should be properly updated', () => {
    const chart = component.chartInstance;
    const series = chart.series[0] as unknown as Highcharts.Series;
    expect(series.color).toEqual('hotpink');
  });
});
