import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxErpInvoiceStep4Component } from './fx-erp-invoice-step4.component';

describe('FxErpInvoiceStep4Component', () => {
  let component: FxErpInvoiceStep4Component;
  let fixture: ComponentFixture<FxErpInvoiceStep4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxErpInvoiceStep4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxErpInvoiceStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
