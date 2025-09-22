import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxErpCashflowStep1Component } from './fx-erp-cashflow-step1.component';

describe('FxErpCashflowStep1Component', () => {
  let component: FxErpCashflowStep1Component;
  let fixture: ComponentFixture<FxErpCashflowStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxErpCashflowStep1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxErpCashflowStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
