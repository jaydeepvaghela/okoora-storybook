import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarTableViewComponent } from './CalendarTableViewComponent';

describe('CalendarTableViewComponent', () => {
  let component: CalendarTableViewComponent;
  let fixture: ComponentFixture<CalendarTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarTableViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
