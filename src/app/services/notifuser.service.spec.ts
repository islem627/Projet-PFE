import { TestBed } from '@angular/core/testing';

import { NotifuserService } from './notifuser.service';

describe('NotifuserService', () => {
  let service: NotifuserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifuserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
