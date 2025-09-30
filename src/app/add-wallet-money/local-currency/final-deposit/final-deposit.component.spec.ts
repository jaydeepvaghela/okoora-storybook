import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalDepositComponent } from './final-deposit.component';

describe('FinalDepositComponent', () => {
  let component: FinalDepositComponent;
  let fixture: ComponentFixture<FinalDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalDepositComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
