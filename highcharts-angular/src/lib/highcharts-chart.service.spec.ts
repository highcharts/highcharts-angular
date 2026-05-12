import { TestBed } from '@angular/core/testing';
import { HighchartsChartService } from './highcharts-chart.service';
import { HIGHCHARTS_LOADER, HIGHCHARTS_OPTIONS, HIGHCHARTS_ROOT_MODULES } from './highcharts-chart.token';
import { ModuleFactoryFunction, InstanceFactoryFunction } from './types';
import type Highcharts from 'highcharts/esm/highcharts';

describe('HighchartsChartService', () => {
  let service: HighchartsChartService;
  let mockLoader: typeof Highcharts;
  let mockGlobalOptions: Highcharts.Options;
  let mockGlobalModules: ModuleFactoryFunction;

  beforeEach(() => {
    mockLoader = {
      setOptions: jasmine.createSpy('setOptions'),
    } as unknown as typeof Highcharts;
    mockGlobalOptions = { lang: { thousandsSep: ',' } };
    mockGlobalModules = jasmine.createSpy('mockGlobalModules').and.returnValue([]);
    const instance = (): Promise<typeof Highcharts> => Promise.resolve(mockLoader);

    TestBed.configureTestingModule({
      providers: [
        HighchartsChartService,
        { provide: HIGHCHARTS_LOADER, useValue: instance },
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
    expect(service.highcharts()).toBeNull();

    await service.load(null);

    expect(service.highcharts()).toBe(mockLoader);
  });

  it('should call setOptions with global options if provided', async () => {
    await service.load(null);

    expect(mockLoader.setOptions).toHaveBeenCalledWith(mockGlobalOptions);
  });

  it('should load global modules if provided', async () => {
    await service.load(null);

    expect(mockGlobalModules).toHaveBeenCalled();
  });

  it('should load partialConfig modules if provided', async () => {
    const mockPartialModules = jasmine.createSpy('mockPartialModules').and.returnValue([]);

    await service.load({ modules: mockPartialModules });

    expect(mockPartialModules).toHaveBeenCalled();
  });

  it('should reuse the shared Highcharts load across multiple load calls', async () => {
    const firstLoad = service.load(null);
    const secondLoad = service.load(null);

    const [firstInstance, secondInstance] = await Promise.all([firstLoad, secondLoad]);

    expect(firstInstance).toBe(mockLoader);
    expect(secondInstance).toBe(mockLoader);
    expect(mockLoader.setOptions).toHaveBeenCalledTimes(1);
  });
});

describe('With not provided Value', () => {
  let service: HighchartsChartService;
  let mockLoader: typeof Highcharts;
  let mockLoaderInstance: InstanceFactoryFunction;

  beforeEach(() => {
    mockLoader = {
      setOptions: jasmine.createSpy('setOptions'),
    } as unknown as typeof Highcharts;

    mockLoaderInstance = () => Promise.resolve(mockLoader);

    TestBed.configureTestingModule({
      providers: [
        HighchartsChartService,
        { provide: HIGHCHARTS_LOADER, useValue: mockLoaderInstance },
        { provide: HIGHCHARTS_OPTIONS, useValue: undefined },
        { provide: HIGHCHARTS_ROOT_MODULES, useValue: undefined },
      ],
    });

    service = TestBed.inject(HighchartsChartService);
  });

  it('should not call setOptions if global options are not provided', async () => {
    await service.load(null);
    const highcharts = await mockLoaderInstance();

    expect(highcharts.setOptions).not.toHaveBeenCalled();
  });
});
