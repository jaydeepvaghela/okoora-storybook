import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxConversionStep5Component } from './fx-conversion-step5.component';

describe('FxConversionStep5Component', () => {
  let component: FxConversionStep5Component;
  let fixture: ComponentFixture<FxConversionStep5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxConversionStep5Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxConversionStep5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
