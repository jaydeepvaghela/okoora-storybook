import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogUploadFileComponent } from './confirm-dialog-upload-file.component';

describe('ConfirmDialogUploadFileComponent', () => {
  let component: ConfirmDialogUploadFileComponent;
  let fixture: ComponentFixture<ConfirmDialogUploadFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDialogUploadFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogUploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
