import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherCurrencyComponent } from './other-currency.component';

describe('OtherCurrencyComponent', () => {
  let component: OtherCurrencyComponent;
  let fixture: ComponentFixture<OtherCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherCurrencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
