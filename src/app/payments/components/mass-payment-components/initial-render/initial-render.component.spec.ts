import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialRenderComponent } from './initial-render.component';

describe('InitialRenderComponent', () => {
  let component: InitialRenderComponent;
  let fixture: ComponentFixture<InitialRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitialRenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitialRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
