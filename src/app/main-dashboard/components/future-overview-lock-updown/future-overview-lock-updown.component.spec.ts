import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureOverviewLockUpdownComponent } from './future-overview-lock-updown.component';

describe('FutureOverviewLockUpdownComponent', () => {
  let component: FutureOverviewLockUpdownComponent;
  let fixture: ComponentFixture<FutureOverviewLockUpdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FutureOverviewLockUpdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FutureOverviewLockUpdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
