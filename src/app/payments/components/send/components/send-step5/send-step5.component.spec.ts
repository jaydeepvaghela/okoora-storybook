import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendStep5Component } from './send-step5.component';

describe('SendStep5Component', () => {
  let component: SendStep5Component;
  let fixture: ComponentFixture<SendStep5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendStep5Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendStep5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
