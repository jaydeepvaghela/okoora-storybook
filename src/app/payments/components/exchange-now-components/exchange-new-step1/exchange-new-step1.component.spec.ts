import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeNewStep1Component } from './exchange-new-step1.component';

describe('ExchangeNewStep1Component', () => {
  let component: ExchangeNewStep1Component;
  let fixture: ComponentFixture<ExchangeNewStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeNewStep1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeNewStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
