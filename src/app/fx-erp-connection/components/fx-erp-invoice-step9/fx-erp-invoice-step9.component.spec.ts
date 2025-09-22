import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxErpInvoiceStep9Component } from './fx-erp-invoice-step9.component';

describe('FxErpInvoiceStep9Component', () => {
  let component: FxErpInvoiceStep9Component;
  let fixture: ComponentFixture<FxErpInvoiceStep9Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxErpInvoiceStep9Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxErpInvoiceStep9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
