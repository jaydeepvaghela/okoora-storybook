import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoPilotListComponent } from './auto-pilot-list.component';

describe('AutoPilotListComponent', () => {
  let component: AutoPilotListComponent;
  let fixture: ComponentFixture<AutoPilotListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoPilotListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoPilotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
