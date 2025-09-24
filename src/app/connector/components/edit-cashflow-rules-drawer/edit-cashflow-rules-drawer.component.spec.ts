import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCashflowRulesDrawerComponent } from './edit-cashflow-rules-drawer.component';

describe('EditCashflowRulesDrawerComponent', () => {
  let component: EditCashflowRulesDrawerComponent;
  let fixture: ComponentFixture<EditCashflowRulesDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCashflowRulesDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCashflowRulesDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
