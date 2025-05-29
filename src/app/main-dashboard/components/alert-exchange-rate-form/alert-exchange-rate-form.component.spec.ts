import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertExchangeRateFormComponent } from './alert-exchange-rate-form.component';

describe('AlertExchangeRateFormComponent', () => {
  let component: AlertExchangeRateFormComponent;
  let fixture: ComponentFixture<AlertExchangeRateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertExchangeRateFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertExchangeRateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
