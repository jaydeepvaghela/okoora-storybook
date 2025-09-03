import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeNewSummaryComponent } from './exchange-new-summary.component';

describe('ExchangeNewSummaryComponent', () => {
  let component: ExchangeNewSummaryComponent;
  let fixture: ComponentFixture<ExchangeNewSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeNewSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeNewSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
