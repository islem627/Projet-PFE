import { TestBed } from '@angular/core/testing';

import { Websocket30Service } from './websocket30.service';

describe('Websocket30Service', () => {
  let service: Websocket30Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Websocket30Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
