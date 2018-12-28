import { CriarEventoModule } from './criar-evento.module';

describe('CriarEventoModule', () => {
  let criarEventoModule: CriarEventoModule;

  beforeEach(() => {
    criarEventoModule = new CriarEventoModule();
  });

  it('should create an instance', () => {
    expect(criarEventoModule).toBeTruthy();
  });
});
