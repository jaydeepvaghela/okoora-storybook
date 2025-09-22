import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxErpInvoiceStep5Component } from './fx-erp-invoice-step5.component';

describe('FxErpInvoiceStep5Component', () => {
  let component: FxErpInvoiceStep5Component;
  let fixture: ComponentFixture<FxErpInvoiceStep5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxErpInvoiceStep5Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxErpInvoiceStep5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
