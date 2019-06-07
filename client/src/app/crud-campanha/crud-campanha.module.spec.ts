import { CrudCampanhaModule } from './crud-campanha.module';

describe('CrudCampanhaModule', () => {
  let crudCampanhaModule: CrudCampanhaModule;

  beforeEach(() => {
    crudCampanhaModule = new CrudCampanhaModule();
  });

  it('should create an instance', () => {
    expect(crudCampanhaModule).toBeTruthy();
  });
});
