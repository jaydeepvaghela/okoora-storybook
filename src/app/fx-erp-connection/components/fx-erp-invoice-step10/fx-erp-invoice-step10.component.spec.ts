import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxErpInvoiceStep10Component } from './fx-erp-invoice-step10.component';

describe('FxErpInvoiceStep10Component', () => {
  let component: FxErpInvoiceStep10Component;
  let fixture: ComponentFixture<FxErpInvoiceStep10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxErpInvoiceStep10Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxErpInvoiceStep10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
