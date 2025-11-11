import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositSummaryComponent } from './deposit-summary.component';

describe('DepositSummaryComponent', () => {
  let component: DepositSummaryComponent;
  let fixture: ComponentFixture<DepositSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
