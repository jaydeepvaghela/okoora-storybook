import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxErpInvoiceStep6Component } from './fx-erp-invoice-step6.component';

describe('FxErpInvoiceStep6Component', () => {
  let component: FxErpInvoiceStep6Component;
  let fixture: ComponentFixture<FxErpInvoiceStep6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxErpInvoiceStep6Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxErpInvoiceStep6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
