import { TipoDeClienteModule } from './tipo-de-cliente.module';

describe('TipoDeClienteModule', () => {
  let tipoDeClienteModule: TipoDeClienteModule;

  beforeEach(() => {
    tipoDeClienteModule = new TipoDeClienteModule();
  });

  it('should create an instance', () => {
    expect(tipoDeClienteModule).toBeTruthy();
  });
});
