import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertStep3Component } from './convert-step3.component';

describe('ConvertStep3Component', () => {
  let component: ConvertStep3Component;
  let fixture: ComponentFixture<ConvertStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvertStep3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvertStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
