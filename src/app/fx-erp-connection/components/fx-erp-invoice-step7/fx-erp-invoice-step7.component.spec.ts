import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxErpInvoiceStep7Component } from './fx-erp-invoice-step7.component';

describe('FxErpInvoiceStep7Component', () => {
  let component: FxErpInvoiceStep7Component;
  let fixture: ComponentFixture<FxErpInvoiceStep7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxErpInvoiceStep7Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxErpInvoiceStep7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
