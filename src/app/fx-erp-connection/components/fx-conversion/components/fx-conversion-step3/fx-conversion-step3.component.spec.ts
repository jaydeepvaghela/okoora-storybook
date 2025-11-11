import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxConversionStep3Component } from './fx-conversion-step3.component';

describe('FxConversionStep3Component', () => {
  let component: FxConversionStep3Component;
  let fixture: ComponentFixture<FxConversionStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxConversionStep3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxConversionStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
