import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedScaComponent } from './embedded-sca.component';

describe('EmbeddedScaComponent', () => {
  let component: EmbeddedScaComponent;
  let fixture: ComponentFixture<EmbeddedScaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmbeddedScaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmbeddedScaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
