import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePaymentSendStep1Component } from './single-payment-send-step1.component';

describe('SinglePaymentSendStep1Component', () => {
  let component: SinglePaymentSendStep1Component;
  let fixture: ComponentFixture<SinglePaymentSendStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinglePaymentSendStep1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglePaymentSendStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
