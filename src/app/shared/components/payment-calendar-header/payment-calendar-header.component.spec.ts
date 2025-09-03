import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCalendarHeaderComponent } from './payment-calendar-header.component';

describe('PaymentCalendarHeaderComponent', () => {
  let component: PaymentCalendarHeaderComponent;
  let fixture: ComponentFixture<PaymentCalendarHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentCalendarHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentCalendarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
