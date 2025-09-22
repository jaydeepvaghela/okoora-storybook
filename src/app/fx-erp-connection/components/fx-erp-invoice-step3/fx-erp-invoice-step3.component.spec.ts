import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxErpInvoiceStep3Component } from './fx-erp-invoice-step3.component';

describe('FxErpInvoiceStep3Component', () => {
  let component: FxErpInvoiceStep3Component;
  let fixture: ComponentFixture<FxErpInvoiceStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxErpInvoiceStep3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxErpInvoiceStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
