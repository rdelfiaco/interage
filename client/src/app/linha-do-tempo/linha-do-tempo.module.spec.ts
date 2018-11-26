import { LinhaDoTempoModule } from './linha-do-tempo.module';

describe('LinhaDoTempoModule', () => {
  let linhaDoTempoModule: LinhaDoTempoModule;

  beforeEach(() => {
    linhaDoTempoModule = new LinhaDoTempoModule();
  });

  it('should create an instance', () => {
    expect(linhaDoTempoModule).toBeTruthy();
  });
});
