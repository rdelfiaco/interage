import { AnalisarCampanhaTelemarketingModule } from './analisar-campanha-telemarketing.module';

describe('AnalisarCampanhaTelemarketingModule', () => {
  let analisarCampanhaTelemarketingModule: AnalisarCampanhaTelemarketingModule;

  beforeEach(() => {
    analisarCampanhaTelemarketingModule = new AnalisarCampanhaTelemarketingModule();
  });

  it('should create an instance', () => {
    expect(analisarCampanhaTelemarketingModule).toBeTruthy();
  });
});
