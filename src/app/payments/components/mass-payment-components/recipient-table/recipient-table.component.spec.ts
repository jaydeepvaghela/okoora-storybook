import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipientTableComponent } from './recipient-table.component';

describe('RecipientTableComponent', () => {
  let component: RecipientTableComponent;
  let fixture: ComponentFixture<RecipientTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipientTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipientTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
