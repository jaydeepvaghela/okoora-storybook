import {ComponentFixture, TestBed} from '@angular/core/testing';

import {KycCreatePasswordComponent} from './kyc-create-password.component';

describe('KycCreatePasswordComponent', () => {
  let component: KycCreatePasswordComponent;
  let fixture: ComponentFixture<KycCreatePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycCreatePasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycCreatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
