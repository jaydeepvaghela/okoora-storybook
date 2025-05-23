import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideTabsContainerComponent } from './side-tabs-container.component';

describe('SideTabsComponent', () => {
  let component: SideTabsContainerComponent;
  let fixture: ComponentFixture<SideTabsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SideTabsContainerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SideTabsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
