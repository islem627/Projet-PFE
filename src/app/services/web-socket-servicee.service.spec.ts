import { TestBed } from '@angular/core/testing';

import { WebSocketServiceeService } from './web-socket-servicee.service';

describe('WebSocketServiceeService', () => {
  let service: WebSocketServiceeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketServiceeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
