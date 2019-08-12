import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemetryChartComponent } from './telemetry-chart.component';

describe('TelemetryChartComponent', () => {
  let component: TelemetryChartComponent;
  let fixture: ComponentFixture<TelemetryChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelemetryChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelemetryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
