import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorsSteppersComponent } from './connectors-steppers.component';

describe('ConnectorsSteppersComponent', () => {
  let component: ConnectorsSteppersComponent;
  let fixture: ComponentFixture<ConnectorsSteppersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectorsSteppersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectorsSteppersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
