import {ComponentFixture, TestBed} from '@angular/core/testing';

import {KycPhoneComponent} from './kyc-phone.component';

describe('KycPhoneComponent', () => {
  let component: KycPhoneComponent;
  let fixture: ComponentFixture<KycPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycPhoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
