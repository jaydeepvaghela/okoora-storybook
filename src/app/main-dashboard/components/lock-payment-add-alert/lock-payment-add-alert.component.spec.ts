import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockPaymentAddAlertComponent } from './lock-payment-add-alert.component';

describe('LockPaymentAddAlertComponent', () => {
  let component: LockPaymentAddAlertComponent;
  let fixture: ComponentFixture<LockPaymentAddAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockPaymentAddAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockPaymentAddAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
