import { TestBed, inject } from '@angular/core/testing';

import { ComunicaPropostaService } from './comunica-proposta.service';

describe('ComunicaPropostaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComunicaPropostaService]
    });
  });

  it('should be created', inject([ComunicaPropostaService], (service: ComunicaPropostaService) => {
    expect(service).toBeTruthy();
  }));
});
