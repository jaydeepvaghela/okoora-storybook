import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorsStep4Component } from './connectors-step4.component';

describe('ConnectorsStep4Component', () => {
  let component: ConnectorsStep4Component;
  let fixture: ComponentFixture<ConnectorsStep4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectorsStep4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectorsStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
