import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConversionRuleComponent } from './delete-conversion-rule.component';

describe('DeleteConversionRuleComponent', () => {
  let component: DeleteConversionRuleComponent;
  let fixture: ComponentFixture<DeleteConversionRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteConversionRuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteConversionRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
