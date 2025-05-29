import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTableViewComponent } from './dashboard-table-view.component';

describe('DashboardTableViewComponent', () => {
  let component: DashboardTableViewComponent;
  let fixture: ComponentFixture<DashboardTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardTableViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
