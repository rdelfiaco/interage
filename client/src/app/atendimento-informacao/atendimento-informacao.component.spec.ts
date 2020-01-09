import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtendimentoInformacaoComponent } from './atendimento-informacao.component';

describe('AtendimentoInformacaoComponent', () => {
  let component: AtendimentoInformacaoComponent;
  let fixture: ComponentFixture<AtendimentoInformacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtendimentoInformacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtendimentoInformacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
