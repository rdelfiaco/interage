import { ConcluirEventoModule } from './concluir-evento.module';

describe('ConcluirEventoModule', () => {
  let concluirEventoModule: ConcluirEventoModule;

  beforeEach(() => {
    concluirEventoModule = new ConcluirEventoModule();
  });

  it('should create an instance', () => {
    expect(concluirEventoModule).toBeTruthy();
  });
});
