import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelldoneNewDashboardComponent } from './welldone-new-dashboard.component';

describe('WelldoneNewDashboardComponent', () => {
  let component: WelldoneNewDashboardComponent;
  let fixture: ComponentFixture<WelldoneNewDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelldoneNewDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelldoneNewDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
