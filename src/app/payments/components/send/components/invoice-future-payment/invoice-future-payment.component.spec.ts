import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSuccessfulComponent } from './invoice-future-payment.component';

describe('UploadSuccessfulComponent', () => {
  let component: UploadSuccessfulComponent;
  let fixture: ComponentFixture<UploadSuccessfulComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadSuccessfulComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadSuccessfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
