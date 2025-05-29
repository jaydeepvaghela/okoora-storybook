import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireStep1Component } from './questionnaire-step1.component';

describe('QuestionnaireStep1Component', () => {
  let component: QuestionnaireStep1Component;
  let fixture: ComponentFixture<QuestionnaireStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionnaireStep1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionnaireStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
