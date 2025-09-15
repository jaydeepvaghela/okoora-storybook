import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBenificiaryStep2Component } from './new-benificiary-step2.component';

describe('NewBenificiaryStep2Component', () => {
  let component: NewBenificiaryStep2Component;
  let fixture: ComponentFixture<NewBenificiaryStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBenificiaryStep2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBenificiaryStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
