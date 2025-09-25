import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxConversionStep6Component } from './fx-conversion-step6.component';

describe('FxConversionStep6Component', () => {
  let component: FxConversionStep6Component;
  let fixture: ComponentFixture<FxConversionStep6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxConversionStep6Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxConversionStep6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
