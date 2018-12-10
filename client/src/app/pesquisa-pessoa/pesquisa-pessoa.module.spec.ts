import { PesquisaPessoaModule } from './pesquisa-pessoa.module';

describe('PesquisaPessoaModule', () => {
  let pesquisaPessoaModule: PesquisaPessoaModule;

  beforeEach(() => {
    pesquisaPessoaModule = new PesquisaPessoaModule();
  });

  it('should create an instance', () => {
    expect(pesquisaPessoaModule).toBeTruthy();
  });
});
