import { TestBed } from '@angular/core/testing';

import { FxDashboardService } from './fx-dashboard.service';

describe('FxDashboardService', () => {
  let service: FxDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FxDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
