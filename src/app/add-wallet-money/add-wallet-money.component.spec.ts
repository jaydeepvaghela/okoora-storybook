import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWalletMoneyComponent } from './add-wallet-money.component';

describe('AddWalletMoneyComponent', () => {
  let component: AddWalletMoneyComponent;
  let fixture: ComponentFixture<AddWalletMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWalletMoneyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWalletMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
