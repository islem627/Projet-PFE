import { TestBed } from '@angular/core/testing';

import { PushNotifactionService } from './push-notifaction.service';

describe('PushNotifactionService', () => {
  let service: PushNotifactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushNotifactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
