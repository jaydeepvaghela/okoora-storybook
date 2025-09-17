import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorAutoProtectComponent } from './connector-auto-protect.component';

describe('ConnectorAutoProtectComponent', () => {
  let component: ConnectorAutoProtectComponent;
  let fixture: ComponentFixture<ConnectorAutoProtectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectorAutoProtectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectorAutoProtectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
