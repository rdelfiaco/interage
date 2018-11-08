import { CadastroPessoaModule } from './cadastro-pessoa.module';

describe('CadastroPessoaModule', () => {
  let cadastroPessoaModule: CadastroPessoaModule;

  beforeEach(() => {
    cadastroPessoaModule = new CadastroPessoaModule();
  });

  it('should create an instance', () => {
    expect(cadastroPessoaModule).toBeTruthy();
  });
});
