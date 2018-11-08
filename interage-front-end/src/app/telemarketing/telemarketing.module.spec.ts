import { TelemarketingModule } from './telemarketing.module';

describe('TelemarketingModule', () => {
  let telemarketingModule: TelemarketingModule;

  beforeEach(() => {
    telemarketingModule = new TelemarketingModule();
  });

  it('should create an instance', () => {
    expect(telemarketingModule).toBeTruthy();
  });
});
