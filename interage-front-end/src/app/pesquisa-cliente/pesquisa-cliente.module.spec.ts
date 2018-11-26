import { PesquisaClienteModule } from './pesquisa-cliente.module';

describe('PesquisaClienteModule', () => {
  let pesquisaClienteModule: PesquisaClienteModule;

  beforeEach(() => {
    pesquisaClienteModule = new PesquisaClienteModule();
  });

  it('should create an instance', () => {
    expect(pesquisaClienteModule).toBeTruthy();
  });
});
