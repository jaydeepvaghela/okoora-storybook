import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendStep4Component } from './send-step4.component';

describe('SendStep4Component', () => {
  let component: SendStep4Component;
  let fixture: ComponentFixture<SendStep4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendStep4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
