import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErpConnectionDialogComponent } from './erp-connection-dialog.component';

describe('ErpConnectionDialogComponent', () => {
  let component: ErpConnectionDialogComponent;
  let fixture: ComponentFixture<ErpConnectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErpConnectionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErpConnectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
