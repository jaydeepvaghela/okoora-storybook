import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePaymentSendStep3Component } from './single-payment-send-step3.component';

describe('SinglePaymentSendStep3Component', () => {
  let component: SinglePaymentSendStep3Component;
  let fixture: ComponentFixture<SinglePaymentSendStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinglePaymentSendStep3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglePaymentSendStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
