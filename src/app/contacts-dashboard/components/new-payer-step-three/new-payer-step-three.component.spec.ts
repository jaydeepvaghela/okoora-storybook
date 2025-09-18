import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPayerStepThreeComponent } from './new-payer-step-three.component';

describe('NewPayerStepThreeComponent', () => {
  let component: NewPayerStepThreeComponent;
  let fixture: ComponentFixture<NewPayerStepThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPayerStepThreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPayerStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
