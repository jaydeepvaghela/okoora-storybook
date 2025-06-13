import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeMainComponent } from './exchange-main.component';

describe('ExchangeComponent', () => {
  let component: ExchangeMainComponent;
  let fixture: ComponentFixture<ExchangeMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
