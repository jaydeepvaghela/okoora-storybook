import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeDoneComponent } from './exchange-done.component';

describe('ExchangeDoneComponent', () => {
  let component: ExchangeDoneComponent;
  let fixture: ComponentFixture<ExchangeDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeDoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
