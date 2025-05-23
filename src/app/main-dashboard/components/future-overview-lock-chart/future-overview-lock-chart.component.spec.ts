import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureOverviewLockChartComponent } from './future-overview-lock-chart.component';

describe('FutureOverviewLockChartComponent', () => {
  let component: FutureOverviewLockChartComponent;
  let fixture: ComponentFixture<FutureOverviewLockChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FutureOverviewLockChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FutureOverviewLockChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
