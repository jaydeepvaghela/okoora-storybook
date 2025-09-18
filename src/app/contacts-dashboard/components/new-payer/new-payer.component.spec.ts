import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPayerComponent } from './new-payer.component';

describe('NewPayerComponent', () => {
  let component: NewPayerComponent;
  let fixture: ComponentFixture<NewPayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
