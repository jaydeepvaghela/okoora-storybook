import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageHedgeDealsComponent } from './manage-hedge-deals.component';

describe('ManageHedgeDealsComponent', () => {
  let component: ManageHedgeDealsComponent;
  let fixture: ComponentFixture<ManageHedgeDealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageHedgeDealsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageHedgeDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
