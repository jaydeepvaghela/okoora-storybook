import {ComponentFixture, TestBed} from '@angular/core/testing';

import {KycAddressComponent} from './kyc-address.component';

describe('KycAddressComponent', () => {
  let component: KycAddressComponent;
  let fixture: ComponentFixture<KycAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
