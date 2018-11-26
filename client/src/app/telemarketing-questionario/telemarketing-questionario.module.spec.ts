import { TelemarketingQuestionarioModule } from './telemarketing-questionario.module';

describe('TelemarketingQuestionarioModule', () => {
  let telemarketingQuestionarioModule: TelemarketingQuestionarioModule;

  beforeEach(() => {
    telemarketingQuestionarioModule = new TelemarketingQuestionarioModule();
  });

  it('should create an instance', () => {
    expect(telemarketingQuestionarioModule).toBeTruthy();
  });
});
