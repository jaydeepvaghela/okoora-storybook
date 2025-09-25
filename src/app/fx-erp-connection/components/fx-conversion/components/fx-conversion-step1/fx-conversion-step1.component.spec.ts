import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxConversionStep1Component } from './fx-conversion-step1.component';

describe('FxConversionStep1Component', () => {
  let component: FxConversionStep1Component;
  let fixture: ComponentFixture<FxConversionStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxConversionStep1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxConversionStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
