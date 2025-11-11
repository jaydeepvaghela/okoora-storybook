import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalCurrencyComponent } from './local-currency.component';

describe('LocalCurrencyComponent', () => {
  let component: LocalCurrencyComponent;
  let fixture: ComponentFixture<LocalCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalCurrencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
