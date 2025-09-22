import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxErpStepperComponent } from './fx-erp-stepper.component';

describe('FxErpStepperComponent', () => {
  let component: FxErpStepperComponent;
  let fixture: ComponentFixture<FxErpStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxErpStepperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxErpStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
