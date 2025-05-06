import {ComponentFixture, TestBed} from '@angular/core/testing';

import {KycEmailConfirmComponent} from './kyc-email-confirm.component';

describe('KycEmailConfirmComponent', () => {
  let component: KycEmailConfirmComponent;
  let fixture: ComponentFixture<KycEmailConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycEmailConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycEmailConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
