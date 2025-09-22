import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPayerSummaryStepComponent } from './new-payer-step-summary.component';

describe('NewPayerStepThreeComponent', () => {
  let component: NewPayerSummaryStepComponent;
  let fixture: ComponentFixture<NewPayerSummaryStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPayerSummaryStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPayerSummaryStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
