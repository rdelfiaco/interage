import { TipoDeRelacionamentoModule } from './tipo-de-relacionamento.module';

describe('TipoDeRelacionamentoModule', () => {
  let tipoDeRelacionamentoModule: TipoDeRelacionamentoModule;

  beforeEach(() => {
    tipoDeRelacionamentoModule = new TipoDeRelacionamentoModule();
  });

  it('should create an instance', () => {
    expect(tipoDeRelacionamentoModule).toBeTruthy();
  });
});
