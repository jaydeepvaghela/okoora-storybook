import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxErpInvoiceStep2Component } from './fx-erp-invoice-step2.component';

describe('FxErpInvoiceStep2Component', () => {
  let component: FxErpInvoiceStep2Component;
  let fixture: ComponentFixture<FxErpInvoiceStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxErpInvoiceStep2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxErpInvoiceStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
