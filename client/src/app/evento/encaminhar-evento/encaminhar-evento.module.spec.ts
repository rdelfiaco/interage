import { EncaminharEventoModule } from './encaminhar-evento.module';

describe('EncaminharEventoModule', () => {
  let encaminharEventoModule: EncaminharEventoModule;

  beforeEach(() => {
    encaminharEventoModule = new EncaminharEventoModule();
  });

  it('should create an instance', () => {
    expect(encaminharEventoModule).toBeTruthy();
  });
});
