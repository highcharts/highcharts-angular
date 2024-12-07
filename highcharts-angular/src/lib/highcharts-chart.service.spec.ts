import { TestBed } from '@angular/core/testing';
import { HighchartsChartService } from './highcharts-chart.service';
import { HIGHCHARTS_LOADER, HIGHCHARTS_OPTIONS, HIGHCHARTS_ROOT_MODULES } from './highcharts-chart.token';
import { Chart, ModuleFactory } from './types';

describe('HighchartsChartService', () => {
  let service: HighchartsChartService;
  let mockLoader: Promise<Chart['highcharts']>;
  let mockGlobalOptions: Chart['options'];
  let mockGlobalModules: ModuleFactory[];

  beforeEach(() => {
    mockLoader = Promise.resolve({
      setOptions: jasmine.createSpy('setOptions'),
    } as unknown as Chart['highcharts']);
    mockGlobalOptions = { lang: { thousandsSep: ',' } };
    mockGlobalModules = [jasmine.createSpy('module1'), jasmine.createSpy('module2')];

    TestBed.configureTestingModule({
      providers: [
        HighchartsChartService,
        { provide: HIGHCHARTS_LOADER, useValue: mockLoader },
        { provide: HIGHCHARTS_OPTIONS, useValue: mockGlobalOptions },
        { provide: HIGHCHARTS_ROOT_MODULES, useValue: mockGlobalModules },
      ],
    });

    service = TestBed.inject(HighchartsChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit the loaded Highcharts instance', async () => {
    const loaderSpy = jasmine.createSpy('loaderSpy');
    service.loaderChanges$.subscribe(loaderSpy);

    service.load();
    await mockLoader;

    expect(loaderSpy).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should call setOptions with global options if provided', async () => {
    service.load();
    const highcharts = await mockLoader;

    expect(highcharts.setOptions).toHaveBeenCalledWith(mockGlobalOptions);
  });

  it('should load global modules if provided', async () => {
    service.load();
    const highcharts = await mockLoader;

    mockGlobalModules.forEach(module => {
      expect(module).toHaveBeenCalledWith(highcharts);
    });
  });

  it('should load partialConfig modules if provided', async () => {
    const mockPartialModules: ModuleFactory[] = [
      jasmine.createSpy('partialModule1'),
      jasmine.createSpy('partialModule2'),
    ];

    service.load({ modules: mockPartialModules });
    const highcharts = await mockLoader;

    mockPartialModules.forEach(module => {
      expect(module).toHaveBeenCalledWith(highcharts);
    });
  });
});

describe('With not provided Value', () => {
  let service: HighchartsChartService;
  let mockLoader: Promise<Chart['highcharts']>;
  let mockGlobalModules: ModuleFactory[];

  beforeEach(() => {
    mockLoader = Promise.resolve({
      setOptions: jasmine.createSpy('setOptions'),
    } as unknown as Chart['highcharts']);
    mockGlobalModules = [];


    TestBed.configureTestingModule({
      providers: [
        HighchartsChartService,
        { provide: HIGHCHARTS_LOADER, useValue: mockLoader },
        { provide: HIGHCHARTS_OPTIONS, useValue: undefined },
        { provide: HIGHCHARTS_ROOT_MODULES, useValue: mockGlobalModules },
      ],
    });

    service = TestBed.inject(HighchartsChartService);
  });

  it('should not call setOptions if global options are not provided', async () => {
    service.load();
    const highcharts = await mockLoader;

    expect(highcharts.setOptions).not.toHaveBeenCalled();
  });
});
