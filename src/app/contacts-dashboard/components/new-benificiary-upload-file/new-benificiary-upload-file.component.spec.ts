import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBenificiaryUploadFileComponent } from './new-benificiary-upload-file.component';

describe('NewBenificiaryUploadFileComponent', () => {
  let component: NewBenificiaryUploadFileComponent;
  let fixture: ComponentFixture<NewBenificiaryUploadFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBenificiaryUploadFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBenificiaryUploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
