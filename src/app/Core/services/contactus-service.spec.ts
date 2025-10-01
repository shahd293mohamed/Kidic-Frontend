import { TestBed } from '@angular/core/testing';

import { ContactusService } from './contactus-service';

describe('Contactus', () => {
  let service: ContactusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
