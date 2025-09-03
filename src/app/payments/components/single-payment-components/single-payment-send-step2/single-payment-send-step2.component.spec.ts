import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePaymentSendStep2Component } from './single-payment-send-step2.component';

describe('SinglePaymentSendStep2Component', () => {
  let component: SinglePaymentSendStep2Component;
  let fixture: ComponentFixture<SinglePaymentSendStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinglePaymentSendStep2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglePaymentSendStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
