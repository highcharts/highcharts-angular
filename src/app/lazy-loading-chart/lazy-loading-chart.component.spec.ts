import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LazyLoadingChartComponent } from './lazy-loading-chart.component';

describe('LazyLoadingChartComponent', () => {
  let component: LazyLoadingChartComponent;
  let fixture: ComponentFixture<LazyLoadingChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LazyLoadingChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LazyLoadingChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
