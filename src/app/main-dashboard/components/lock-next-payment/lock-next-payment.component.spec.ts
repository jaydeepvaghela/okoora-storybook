import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockNextPaymentComponent } from './lock-next-payment.component';

describe('LockNextPaymentComponent', () => {
  let component: LockNextPaymentComponent;
  let fixture: ComponentFixture<LockNextPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockNextPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockNextPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
