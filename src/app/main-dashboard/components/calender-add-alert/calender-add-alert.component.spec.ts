import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderAddAlertComponent } from './calender-add-alert.component';

describe('CalenderAddAlertComponent', () => {
  let component: CalenderAddAlertComponent;
  let fixture: ComponentFixture<CalenderAddAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalenderAddAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalenderAddAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
