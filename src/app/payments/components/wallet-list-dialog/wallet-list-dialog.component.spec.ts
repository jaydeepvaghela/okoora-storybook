import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletListDialogComponent } from './wallet-list-dialog.component';

describe('WalletListDialogComponent', () => {
  let component: WalletListDialogComponent;
  let fixture: ComponentFixture<WalletListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletListDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
