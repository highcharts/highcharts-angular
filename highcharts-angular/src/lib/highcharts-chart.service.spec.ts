import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HighchartsChartService } from './highcharts-chart.service';
import { HIGHCHARTS_LOADER, HIGHCHARTS_OPTIONS, HIGHCHARTS_ROOT_MODULES } from './highcharts-chart.token';
import { Chart, ModuleFactoryFunction, InstanceFactoryFunction } from './types';

describe('HighchartsChartService', () => {
  let service: HighchartsChartService;
  let mockLoader: Chart['highcharts'];
  let mockGlobalOptions: Chart['options'];
  let mockGlobalModules: ModuleFactoryFunction;

  beforeEach(() => {
    // Mock Highcharts instance with the setOptions method
    mockLoader = {
      version: '11.0.0',
      setOptions: jasmine.createSpy('setOptions'),
    } as unknown as Chart['highcharts']
    mockGlobalOptions = { lang: { thousandsSep: ',' } };
    mockGlobalModules = jasmine.createSpy('mockGlobalModules').and.returnValue([
      Promise.resolve({ default: jasmine.createSpy() }),
      Promise.resolve({ default: jasmine.createSpy() }),
    ]);
    const instance = () => Promise.resolve(mockLoader);

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

  it('should emit the loaded Highcharts instance', fakeAsync(() => {
    const loaderSpy = jasmine.createSpy('loaderSpy');
    service.loaderChanges$.subscribe(loaderSpy);

    service.load();
    tick(100); // Simulate the passage of time for the timeout in the load method

    expect(loaderSpy).toHaveBeenCalledWith(jasmine.any(Object)); // The Highcharts object should be emitted
  }));

  it('should call setOptions with global options if provided', fakeAsync(() => {
    service.load();
    tick(100); // Simulate the passage of time for the timeout in the load method

    // Check if setOptions was called with the global options
    expect(mockLoader.setOptions).toHaveBeenCalledWith(mockGlobalOptions);
  }));

  it('should load global modules if provided', fakeAsync(() => {
    service.load();
    tick(100); // Simulate the passage of time for the timeout in the load method

    // Wait for each module to resolve, then check if its `default` method was called with highcharts
    mockGlobalModules().forEach((moduleSpy) => {
      moduleSpy.then((module) => {
        expect(module.default).toHaveBeenCalledWith(mockLoader);
      })
    });
  }));

  it('should load partialConfig modules if provided', fakeAsync(() => {
    const mockPartialModules = jasmine.createSpy('mockPartialModules').and.returnValue([
      Promise.resolve({default: jasmine.createSpy()}),
      Promise.resolve({default: jasmine.createSpy()}),
    ]);

    // Call the load method with partial modules
    service.load({modules: mockPartialModules});
    tick(100); // Simulate the passage of time for the timeout in the load method

    // Wait for each module to resolve and check if `default` was called with highcharts
    mockGlobalModules().forEach((moduleSpy) => {
      moduleSpy.then((resolvedModule) => {
        expect(resolvedModule.default).toHaveBeenCalledWith(mockLoader);
      })
    });
  }));
});

describe('With not provided Value', () => {
  let service: HighchartsChartService;
  let mockLoader: Chart['highcharts'];
  let mockLoaderInstance: InstanceFactoryFunction;

  beforeEach(() => {
    mockLoader = {
      version: '11.0.0',
      setOptions: jasmine.createSpy('setOptions'),
    } as unknown as Chart['highcharts']

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
    service.load();
    const highcharts = await mockLoaderInstance();

    expect(highcharts.setOptions).not.toHaveBeenCalled();
  });
});


describe('With Version 12', () => {
  let service: HighchartsChartService;
  let mockLoader: Chart['highcharts'];
  let mockGlobalModules: ModuleFactoryFunction;

  beforeEach(() => {
    mockLoader = {
      version: '12.0.0',
      setOptions: jasmine.createSpy('setOptions'),
    } as unknown as Chart['highcharts']
    mockGlobalModules = jasmine.createSpy('mockGlobalModules').and.returnValue([
      Promise.resolve({ default: jasmine.createSpy() }),
      Promise.resolve({ default: jasmine.createSpy() }),
    ]);

    const instance = () => Promise.resolve(mockLoader);


    TestBed.configureTestingModule({
      providers: [
        HighchartsChartService,
        { provide: HIGHCHARTS_LOADER, useValue: instance },
        { provide: HIGHCHARTS_OPTIONS, useValue: undefined },
        { provide: HIGHCHARTS_ROOT_MODULES, useValue: mockGlobalModules },
      ],
    });

    service = TestBed.inject(HighchartsChartService);
  });

  it('should load global modules without default', fakeAsync(() => {
    service.load();
    tick(100); // Simulate the passage of time for the timeout in the load method

    // Wait for each module to resolve, then check if its `default` method was called with highcharts
    mockGlobalModules().forEach((moduleSpy) => {
      moduleSpy.then((module) => {
        expect(module.default).not.toHaveBeenCalledWith(mockLoader);
      })
    });
  }));
});
