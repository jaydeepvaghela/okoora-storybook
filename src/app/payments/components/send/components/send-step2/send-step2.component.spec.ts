import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendStep2Component } from './send-step2.component';

describe('SendStep2Component', () => {
  let component: SendStep2Component;
  let fixture: ComponentFixture<SendStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendStep2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
