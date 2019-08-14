import { CanaisModule } from './canais.module';

describe('CanaisModule', () => {
  let canaisModule: CanaisModule;

  beforeEach(() => {
    canaisModule = new CanaisModule();
  });

  it('should create an instance', () => {
    expect(canaisModule).toBeTruthy();
  });
});
