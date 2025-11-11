import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxErpInvoiceStep12Component } from './fx-erp-invoice-step12.component';

describe('FxErpInvoiceStep12Component', () => {
  let component: FxErpInvoiceStep12Component;
  let fixture: ComponentFixture<FxErpInvoiceStep12Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxErpInvoiceStep12Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxErpInvoiceStep12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
