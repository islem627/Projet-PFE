import { TestBed } from '@angular/core/testing';

import { WebSocketPartnerService } from './web-socket-partner.service';

describe('WebSocketPartnerService', () => {
  let service: WebSocketPartnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketPartnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
