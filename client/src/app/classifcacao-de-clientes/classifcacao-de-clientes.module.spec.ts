import { ClassifcacaoDeClientesModule } from './classifcacao-de-clientes.module';

describe('ClassifcacaoDeClientesModule', () => {
  let classifcacaoDeClientesModule: ClassifcacaoDeClientesModule;

  beforeEach(() => {
    classifcacaoDeClientesModule = new ClassifcacaoDeClientesModule();
  });

  it('should create an instance', () => {
    expect(classifcacaoDeClientesModule).toBeTruthy();
  });
});
