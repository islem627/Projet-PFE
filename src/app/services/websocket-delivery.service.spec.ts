import { TestBed } from '@angular/core/testing';

import { WebsocketDeliveryService } from './websocket-delivery.service';

describe('WebsocketDeliveryService', () => {
  let service: WebsocketDeliveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketDeliveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
