import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureOverviewHedgeChartComponent } from './future-overview-hedge-chart.component';

describe('FutureOverviewHedgeChartComponent', () => {
  let component: FutureOverviewHedgeChartComponent;
  let fixture: ComponentFixture<FutureOverviewHedgeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FutureOverviewHedgeChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FutureOverviewHedgeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
