import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalProtectiveDialogComponent } from './approval-protective-dialog.component';

describe('ApprovalProtectiveDialogComponent', () => {
  let component: ApprovalProtectiveDialogComponent;
  let fixture: ComponentFixture<ApprovalProtectiveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalProtectiveDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalProtectiveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
