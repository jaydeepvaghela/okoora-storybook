import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPayerStepOneComponent } from './new-payer-step-one.component';

describe('NewPayerStepOneComponent', () => {
  let component: NewPayerStepOneComponent;
  let fixture: ComponentFixture<NewPayerStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPayerStepOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPayerStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
