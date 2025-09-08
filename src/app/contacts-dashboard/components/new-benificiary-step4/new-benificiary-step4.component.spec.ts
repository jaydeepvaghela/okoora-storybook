import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBenificiaryStep4Component } from './new-benificiary-step4.component';

describe('NewBenificiaryStep4Component', () => {
  let component: NewBenificiaryStep4Component;
  let fixture: ComponentFixture<NewBenificiaryStep4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBenificiaryStep4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBenificiaryStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
