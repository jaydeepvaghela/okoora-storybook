import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBenificiaryComponent } from './new-benificiary.component';

describe('NewBenificiaryComponent', () => {
  let component: NewBenificiaryComponent;
  let fixture: ComponentFixture<NewBenificiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBenificiaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBenificiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
