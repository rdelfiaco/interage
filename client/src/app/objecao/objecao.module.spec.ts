import { ObjecaoModule } from './objecao.module';

describe('ObjecaoModule', () => {
  let objecaoModule: ObjecaoModule;

  beforeEach(() => {
    objecaoModule = new ObjecaoModule();
  });

  it('should create an instance', () => {
    expect(objecaoModule).toBeTruthy();
  });
});
