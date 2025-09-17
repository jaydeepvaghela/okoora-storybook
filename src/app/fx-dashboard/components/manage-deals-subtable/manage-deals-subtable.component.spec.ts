import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDealsSubtableComponent } from './manage-deals-subtable.component';

describe('ManageDealsSubtableComponent', () => {
  let component: ManageDealsSubtableComponent;
  let fixture: ComponentFixture<ManageDealsSubtableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDealsSubtableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDealsSubtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
