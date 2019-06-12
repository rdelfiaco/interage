import { TestBed, inject } from '@angular/core/testing';

import { CrudCampanhaService } from './crud-campanha.service';

describe('CrudCampanhaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrudCampanhaService]
    });
  });

  it('should be created', inject([CrudCampanhaService], (service: CrudCampanhaService) => {
    expect(service).toBeTruthy();
  }));
});
