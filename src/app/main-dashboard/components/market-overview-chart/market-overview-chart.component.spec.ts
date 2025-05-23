import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketOverviewChartComponent } from './market-overview-chart.component';

describe('MarketOverviewChartComponent', () => {
  let component: MarketOverviewChartComponent;
  let fixture: ComponentFixture<MarketOverviewChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketOverviewChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketOverviewChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
