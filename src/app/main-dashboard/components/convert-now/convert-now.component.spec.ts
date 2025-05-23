import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertNowComponent } from './convert-now.component';

describe('ConvertNowComponent', () => {
  let component: ConvertNowComponent;
  let fixture: ComponentFixture<ConvertNowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvertNowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvertNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
