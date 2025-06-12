import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePaymentSendCompletedComponent } from './single-payment-send-completed.component';

describe('SinglePaymentSendCompletedComponent', () => {
  let component: SinglePaymentSendCompletedComponent;
  let fixture: ComponentFixture<SinglePaymentSendCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinglePaymentSendCompletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglePaymentSendCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
