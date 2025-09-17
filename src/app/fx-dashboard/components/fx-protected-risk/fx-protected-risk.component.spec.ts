import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxProtectedRiskComponent } from './fx-protected-risk.component';

describe('FxProtectedRiskComponent', () => {
  let component: FxProtectedRiskComponent;
  let fixture: ComponentFixture<FxProtectedRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxProtectedRiskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxProtectedRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
