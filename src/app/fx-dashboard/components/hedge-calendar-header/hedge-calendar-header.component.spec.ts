import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HedgeCalendarHeaderComponent } from './hedge-calendar-header.component';

describe('HedgeCalendarHeaderComponent', () => {
  let component: HedgeCalendarHeaderComponent;
  let fixture: ComponentFixture<HedgeCalendarHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HedgeCalendarHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HedgeCalendarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
