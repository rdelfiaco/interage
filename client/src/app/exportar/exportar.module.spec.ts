import { ExportarModule } from './exportar.module';

describe('ExportarModule', () => {
  let exportarModule: ExportarModule;

  beforeEach(() => {
    exportarModule = new ExportarModule();
  });

  it('should create an instance', () => {
    expect(exportarModule).toBeTruthy();
  });
});
