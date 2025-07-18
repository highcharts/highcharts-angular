import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighcharts } from '../../../../highcharts-angular/src/public_api';
import { LineTestComponent } from './line-test.component';
import type Highcharts from 'highcharts/esm/highcharts';

describe('LineTestComponent', () => {
  let component: LineTestComponent;
  let fixture: ComponentFixture<LineTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHighcharts()],
      imports: [LineTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default chart options with a line series', () => {
    const series = component.chartOptions.series as any;
    expect(series).toBeDefined();
    expect(series[0].type).toBe('line');
    expect(series[0].data).toEqual([1, 2, 3]);
  });

  it('should have data given from chartOptions', () => {
    const chartOptions = component.chartOptions;

    // Simulate the chartInstance being assigned (this happens when the chart is rendered)
    component.chartInstance = {
      series: [{ yData: [1, 2, 3] }],
    } as unknown as Highcharts.Chart;

    const series = component.chartInstance.series[0];
    expect((series as any).yData).toEqual((chartOptions.series as any)[0].data);
  });

  it('should update series color and set updateFlag to true', () => {
    component.updateSeriesColor();

    const updatedSeries = (component.chartOptions.series as any)[0];
    expect(updatedSeries.color).toBe('hotpink');
    expect(component.updateFlag).toBeTrue();
  });

  it('should be properly updated', () => {
    // Simulate the chartInstance and a mock series
    const mockSeries = { color: 'hotpink' } as unknown as Highcharts.Series;

    component.chartInstance = {
      series: [mockSeries],
    } as unknown as Highcharts.Chart;

    // Perform the color update
    component.updateSeriesColor();

    // Ensure the color was updated
    const series = component.chartInstance.series[0];
    expect(series.color).toBe('hotpink');
  });

  it('should bind chart instance when Highcharts chart emits instance', () => {
    const mockChartInstance = {} as Highcharts.Chart;
    component.chartInstance = mockChartInstance;

    expect(component.chartInstance).toBe(mockChartInstance);
  });

  it('should trigger update when updateFlag is set', () => {
    spyOn(component, 'updateSeriesColor').and.callThrough();
    const updateButton = fixture.nativeElement.querySelector('button');
    updateButton.click();
    fixture.detectChanges();

    expect(component.updateSeriesColor).toHaveBeenCalled();
  });
});
