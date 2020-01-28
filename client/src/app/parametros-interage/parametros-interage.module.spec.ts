import { ParametrosInterageModule } from './parametros-interage.module';

describe('ParametrosInterageModule', () => {
  let parametrosInterageModule: ParametrosInterageModule;

  beforeEach(() => {
    parametrosInterageModule = new ParametrosInterageModule();
  });

  it('should create an instance', () => {
    expect(parametrosInterageModule).toBeTruthy();
  });
});
