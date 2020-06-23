import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapChartComponent } from './map-chart.component';

describe('MapChartComponent', () => {
  let component: MapChartComponent;
  let fixture: ComponentFixture<MapChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
