import {ComponentFixture, TestBed} from '@angular/core/testing';

import {KycPersonalDetailsComponent} from './kyc-personal-details.component';

describe('KycPersonalDetailsComponent', () => {
  let component: KycPersonalDetailsComponent;
  let fixture: ComponentFixture<KycPersonalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycPersonalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
