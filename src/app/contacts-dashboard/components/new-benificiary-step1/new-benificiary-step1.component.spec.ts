import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBenificiaryStep1Component } from './new-benificiary-step1.component';

describe('NewBenificiaryStep1Component', () => {
  let component: NewBenificiaryStep1Component;
  let fixture: ComponentFixture<NewBenificiaryStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBenificiaryStep1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBenificiaryStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
