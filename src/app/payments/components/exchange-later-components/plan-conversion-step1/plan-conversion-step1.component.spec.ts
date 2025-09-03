import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanConversionStep1Component } from './plan-conversion-step1.component';

describe('PlanConversionStep1Component', () => {
  let component: PlanConversionStep1Component;
  let fixture: ComponentFixture<PlanConversionStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanConversionStep1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanConversionStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
