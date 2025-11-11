import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxConversionSteppersComponent } from './fx-conversion-steppers.component';

describe('FxConversionSteppersComponent', () => {
  let component: FxConversionSteppersComponent;
  let fixture: ComponentFixture<FxConversionSteppersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxConversionSteppersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxConversionSteppersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
