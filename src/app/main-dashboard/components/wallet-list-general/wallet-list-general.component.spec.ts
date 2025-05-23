import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletListGeneralComponent } from './wallet-list-general.component';

describe('WalletListGeneralComponent', () => {
  let component: WalletListGeneralComponent;
  let fixture: ComponentFixture<WalletListGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletListGeneralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletListGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
