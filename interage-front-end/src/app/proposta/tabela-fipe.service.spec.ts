import { TestBed, inject } from '@angular/core/testing';

import { TabelaFipeService } from './tabela-fipe.service';

describe('TabelaFipeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TabelaFipeService]
    });
  });

  it('should be created', inject([TabelaFipeService], (service: TabelaFipeService) => {
    expect(service).toBeTruthy();
  }));
});
