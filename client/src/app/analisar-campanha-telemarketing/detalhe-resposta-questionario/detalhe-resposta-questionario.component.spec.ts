import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheRespostaQuestionarioComponent } from './detalhe-resposta-questionario.component';

describe('DetalheRespostaQuestionarioComponent', () => {
  let component: DetalheRespostaQuestionarioComponent;
  let fixture: ComponentFixture<DetalheRespostaQuestionarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalheRespostaQuestionarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalheRespostaQuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
