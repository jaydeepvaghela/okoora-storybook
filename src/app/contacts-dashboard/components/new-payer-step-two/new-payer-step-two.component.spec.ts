import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPayerStepTwoComponent } from './new-payer-step-two.component';

describe('NewPayerStepTwoComponent', () => {
  let component: NewPayerStepTwoComponent;
  let fixture: ComponentFixture<NewPayerStepTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPayerStepTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPayerStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
