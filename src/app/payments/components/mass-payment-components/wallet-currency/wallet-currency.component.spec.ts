import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCurrencyComponent } from './wallet-currency.component';

describe('WalletCurrencyComponent', () => {
  let component: WalletCurrencyComponent;
  let fixture: ComponentFixture<WalletCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletCurrencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
