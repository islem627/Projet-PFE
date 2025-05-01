import { TestBed } from '@angular/core/testing';

import { ChattserviceService } from './chattservice.service';

describe('ChattserviceService', () => {
  let service: ChattserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChattserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
