import { AtendimentoModule } from './atendimento.module';

describe('AtendimentoModule', () => {
  let atendimentoModule: AtendimentoModule;

  beforeEach(() => {
    atendimentoModule = new AtendimentoModule();
  });

  it('should create an instance', () => {
    expect(atendimentoModule).toBeTruthy();
  });
});
