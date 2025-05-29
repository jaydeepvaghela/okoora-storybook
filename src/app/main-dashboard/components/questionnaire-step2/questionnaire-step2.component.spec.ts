import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireStep2Component } from './questionnaire-step2.component';

describe('QuestionnaireStep2Component', () => {
  let component: QuestionnaireStep2Component;
  let fixture: ComponentFixture<QuestionnaireStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionnaireStep2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionnaireStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
