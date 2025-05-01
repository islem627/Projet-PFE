import { TestBed } from '@angular/core/testing';

import { NotifserviceService } from './notifservice.service';

describe('NotifserviceService', () => {
  let service: NotifserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
