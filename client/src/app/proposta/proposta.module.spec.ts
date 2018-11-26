import { PropostaModule } from './proposta.module';

describe('PropostaModule', () => {
  let propostaModule: PropostaModule;

  beforeEach(() => {
    propostaModule = new PropostaModule();
  });

  it('should create an instance', () => {
    expect(propostaModule).toBeTruthy();
  });
});
