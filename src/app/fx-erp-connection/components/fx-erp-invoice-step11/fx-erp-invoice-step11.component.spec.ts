import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxErpInvoiceStep11Component } from './fx-erp-invoice-step11.component';

describe('FxErpInvoiceStep11Component', () => {
  let component: FxErpInvoiceStep11Component;
  let fixture: ComponentFixture<FxErpInvoiceStep11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxErpInvoiceStep11Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxErpInvoiceStep11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
