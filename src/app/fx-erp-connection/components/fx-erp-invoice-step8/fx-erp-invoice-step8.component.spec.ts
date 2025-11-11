import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxErpInvoiceStep8Component } from './fx-erp-invoice-step8.component';

describe('FxErpInvoiceStep8Component', () => {
  let component: FxErpInvoiceStep8Component;
  let fixture: ComponentFixture<FxErpInvoiceStep8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxErpInvoiceStep8Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxErpInvoiceStep8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
