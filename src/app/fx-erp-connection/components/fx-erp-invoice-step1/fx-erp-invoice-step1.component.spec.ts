import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxErpInvoiceStep1Component } from './fx-erp-invoice-step1.component';

describe('FxErpInvoiceStep1Component', () => {
  let component: FxErpInvoiceStep1Component;
  let fixture: ComponentFixture<FxErpInvoiceStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxErpInvoiceStep1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxErpInvoiceStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
