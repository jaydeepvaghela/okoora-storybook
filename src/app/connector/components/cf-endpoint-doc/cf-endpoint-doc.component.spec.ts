import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfEndpointDocComponent } from './cf-endpoint-doc.component';

describe('CfEndpointDocComponent', () => {
  let component: CfEndpointDocComponent;
  let fixture: ComponentFixture<CfEndpointDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfEndpointDocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CfEndpointDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
