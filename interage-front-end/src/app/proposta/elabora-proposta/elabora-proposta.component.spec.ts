import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElaboraPropostaComponent } from './elabora-proposta.component';

describe('ElaboraPropostaComponent', () => {
  let component: ElaboraPropostaComponent;
  let fixture: ComponentFixture<ElaboraPropostaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElaboraPropostaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElaboraPropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
