import { FormularioEventoModule } from './formulario-evento.module';

describe('FormularioEventoModule', () => {
  let formularioEventoModule: FormularioEventoModule;

  beforeEach(() => {
    formularioEventoModule = new FormularioEventoModule();
  });

  it('should create an instance', () => {
    expect(formularioEventoModule).toBeTruthy();
  });
});
