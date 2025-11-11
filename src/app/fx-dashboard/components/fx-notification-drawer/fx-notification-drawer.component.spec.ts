import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxNotificationDrawerComponent } from './fx-notification-drawer.component';

describe('FxNotificationDrawerComponent', () => {
  let component: FxNotificationDrawerComponent;
  let fixture: ComponentFixture<FxNotificationDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxNotificationDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxNotificationDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
