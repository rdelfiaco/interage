import { AtendimentoInformacaoModule } from './atendimento-informacao.module';

describe('AtendimentoInformacaoModule', () => {
  let atendimentoInformacaoModule: AtendimentoInformacaoModule;

  beforeEach(() => {
    atendimentoInformacaoModule = new AtendimentoInformacaoModule();
  });

  it('should create an instance', () => {
    expect(atendimentoInformacaoModule).toBeTruthy();
  });
});
