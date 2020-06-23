import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttChartComponent } from './gantt-chart.component';

describe('GanttChartComponent', () => {
  let component: GanttChartComponent;
  let fixture: ComponentFixture<GanttChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
