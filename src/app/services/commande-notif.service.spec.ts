import { TestBed } from '@angular/core/testing';

import { CommandeNotifService } from './commande-notif.service';

describe('CommandeNotifService', () => {
  let service: CommandeNotifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandeNotifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
