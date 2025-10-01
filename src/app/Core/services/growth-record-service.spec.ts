import { TestBed } from '@angular/core/testing';

import { GrowthRecordService } from './growth-record-service';

describe('GrowthRecordService', () => {
  let service: GrowthRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrowthRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
