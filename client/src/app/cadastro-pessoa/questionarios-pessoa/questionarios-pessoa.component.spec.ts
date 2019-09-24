import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionariosPessoaComponent } from './questionarios-pessoa.component';

describe('QuestionariosPessoaComponent', () => {
  let component: QuestionariosPessoaComponent;
  let fixture: ComponentFixture<QuestionariosPessoaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionariosPessoaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionariosPessoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
