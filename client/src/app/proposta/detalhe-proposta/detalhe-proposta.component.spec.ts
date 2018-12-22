import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhePropostaComponent } from './detalhe-proposta.component';

describe('DetalhePropostaComponent', () => {
  let component: DetalhePropostaComponent;
  let fixture: ComponentFixture<DetalhePropostaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalhePropostaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalhePropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
