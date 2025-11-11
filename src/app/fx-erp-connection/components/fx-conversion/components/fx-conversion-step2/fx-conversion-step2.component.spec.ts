import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxConversionStep2Component } from './fx-conversion-step2.component';

describe('FxConversionStep2Component', () => {
  let component: FxConversionStep2Component;
  let fixture: ComponentFixture<FxConversionStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxConversionStep2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxConversionStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
