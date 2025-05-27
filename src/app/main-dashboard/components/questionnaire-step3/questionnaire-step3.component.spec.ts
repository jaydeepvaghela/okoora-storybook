import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireStep3Component } from './questionnaire-step3.component';

describe('QuestionnaireStep3Component', () => {
  let component: QuestionnaireStep3Component;
  let fixture: ComponentFixture<QuestionnaireStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionnaireStep3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionnaireStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
