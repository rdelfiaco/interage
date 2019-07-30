import { PausaModule } from './pausa.module';

describe('PausaModule', () => {
  let pausaModule: PausaModule;

  beforeEach(() => {
    pausaModule = new PausaModule();
  });

  it('should create an instance', () => {
    expect(pausaModule).toBeTruthy();
  });
});
