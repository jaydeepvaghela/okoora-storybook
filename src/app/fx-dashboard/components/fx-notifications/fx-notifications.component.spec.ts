import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxNotificationsComponent } from './fx-notifications.component';

describe('FxNotificationsComponent', () => {
  let component: FxNotificationsComponent;
  let fixture: ComponentFixture<FxNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxNotificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
