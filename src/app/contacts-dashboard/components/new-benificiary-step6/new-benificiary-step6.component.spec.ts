import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBenificiaryStep6Component } from './new-benificiary-step6.component';

describe('NewBenificiaryStep6Component', () => {
  let component: NewBenificiaryStep6Component;
  let fixture: ComponentFixture<NewBenificiaryStep6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBenificiaryStep6Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBenificiaryStep6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
