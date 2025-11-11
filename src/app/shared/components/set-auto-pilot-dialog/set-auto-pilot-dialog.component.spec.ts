import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetAutoPilotDialogComponent } from './set-auto-pilot-dialog.component';

describe('SetAutoPilotDialogComponent', () => {
  let component: SetAutoPilotDialogComponent;
  let fixture: ComponentFixture<SetAutoPilotDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetAutoPilotDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetAutoPilotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
