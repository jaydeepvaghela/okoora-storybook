import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountConfirmationComponent } from './bank-account-confirmation.component';

describe('BankAccountConfirmationComponent', () => {
  let component: BankAccountConfirmationComponent;
  let fixture: ComponentFixture<BankAccountConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccountConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankAccountConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
