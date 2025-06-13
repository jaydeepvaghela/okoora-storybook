import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanConversionDoneComponent } from './plan-conversion-done.component';

describe('PlanConversionDoneComponent', () => {
  let component: PlanConversionDoneComponent;
  let fixture: ComponentFixture<PlanConversionDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanConversionDoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanConversionDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
