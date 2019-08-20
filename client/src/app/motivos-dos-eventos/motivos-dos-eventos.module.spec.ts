import { MotivosDosEventosModule } from './motivos-dos-eventos.module';

describe('MotivosDosEventosModule', () => {
  let motivosDosEventosModule: MotivosDosEventosModule;

  beforeEach(() => {
    motivosDosEventosModule = new MotivosDosEventosModule();
  });

  it('should create an instance', () => {
    expect(motivosDosEventosModule).toBeTruthy();
  });
});
