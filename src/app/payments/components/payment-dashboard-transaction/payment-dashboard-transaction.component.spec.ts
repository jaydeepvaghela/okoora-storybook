import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDashboardTransactionComponent } from './payment-dashboard-transaction.component';

describe('PaymentDashboardTransactionComponent', () => {
  let component: PaymentDashboardTransactionComponent;
  let fixture: ComponentFixture<PaymentDashboardTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDashboardTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentDashboardTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
