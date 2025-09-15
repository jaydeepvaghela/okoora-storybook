import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBenificiaryStep5Component } from './new-benificiary-step5.component';

describe('NewBenificiaryStep5Component', () => {
  let component: NewBenificiaryStep5Component;
  let fixture: ComponentFixture<NewBenificiaryStep5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBenificiaryStep5Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBenificiaryStep5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
