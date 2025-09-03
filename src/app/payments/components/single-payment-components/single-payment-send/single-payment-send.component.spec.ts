import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePaymentSendComponent } from './single-payment-send.component';

describe('SinglePaymentSendComponent', () => {
  let component: SinglePaymentSendComponent;
  let fixture: ComponentFixture<SinglePaymentSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinglePaymentSendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglePaymentSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
