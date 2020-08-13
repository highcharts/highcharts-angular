import { TestBed } from '@angular/core/testing';

import { AppleDataService } from './apple-data.service';

describe('AppleDataService', () => {
  let service: AppleDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppleDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
