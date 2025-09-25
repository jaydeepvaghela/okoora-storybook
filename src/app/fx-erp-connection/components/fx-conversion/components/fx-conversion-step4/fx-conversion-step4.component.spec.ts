import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxConversionStep4Component } from './fx-conversion-step4.component';

describe('FxConversionStep4Component', () => {
  let component: FxConversionStep4Component;
  let fixture: ComponentFixture<FxConversionStep4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxConversionStep4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxConversionStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
