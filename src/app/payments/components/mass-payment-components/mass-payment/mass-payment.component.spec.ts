import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassPaymentComponent } from './mass-payment.component';

describe('MassPaymentComponent', () => {
  let component: MassPaymentComponent;
  let fixture: ComponentFixture<MassPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MassPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MassPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
