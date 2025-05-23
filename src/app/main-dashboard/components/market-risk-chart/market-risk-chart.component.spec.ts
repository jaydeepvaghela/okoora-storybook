import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketRiskChartComponent } from './market-risk-chart.component';

describe('MarketRiskChartComponent', () => {
  let component: MarketRiskChartComponent;
  let fixture: ComponentFixture<MarketRiskChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketRiskChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketRiskChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
