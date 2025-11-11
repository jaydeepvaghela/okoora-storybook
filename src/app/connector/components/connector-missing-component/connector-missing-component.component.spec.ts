import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorMissingComponentComponent } from './connector-missing-component.component';

describe('ConnectorMissingComponentComponent', () => {
  let component: ConnectorMissingComponentComponent;
  let fixture: ComponentFixture<ConnectorMissingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectorMissingComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectorMissingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
