import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHedgeDealsFilterComponent } from './manage-hedge-deals-filter.component';

describe('ManageHedgeDealsFilterComponent', () => {
  let component: ManageHedgeDealsFilterComponent;
  let fixture: ComponentFixture<ManageHedgeDealsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageHedgeDealsFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageHedgeDealsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
