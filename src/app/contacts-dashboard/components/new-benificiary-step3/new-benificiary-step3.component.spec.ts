import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBenificiaryStep3Component } from './new-benificiary-step3.component';

describe('NewBenificiaryStep3Component', () => {
  let component: NewBenificiaryStep3Component;
  let fixture: ComponentFixture<NewBenificiaryStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBenificiaryStep3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBenificiaryStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
