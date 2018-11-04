import { SemPermissaoModule } from './sem-permissao.module';

describe('SemPermissaoModule', () => {
  let semPermissaoModule: SemPermissaoModule;

  beforeEach(() => {
    semPermissaoModule = new SemPermissaoModule();
  });

  it('should create an instance', () => {
    expect(semPermissaoModule).toBeTruthy();
  });
});
