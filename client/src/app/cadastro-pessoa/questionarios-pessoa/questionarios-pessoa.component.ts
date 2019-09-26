import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectHTTP } from '../../shared/services/connectHTTP';

@Component({
  selector: 'app-questionarios-pessoa',
  templateUrl: './questionarios-pessoa.component.html',
  styleUrls: ['./questionarios-pessoa.component.scss']
})
export class QuestionariosPessoaComponent implements OnInit {
  @Output() refresh = new EventEmitter();
  @Input() pessoa: Observable<string[]>;
  questRespAnalitica = [];
  questionarioSelecionado = '';
  _pessoaObject
  constructor(
    private connectHTTP: ConnectHTTP,
  ) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['pessoa'] && this.pessoa) {
      this.pessoa.subscribe(pessoa => {
        this._pessoaObject = pessoa;
        this.getQuestariosPessoaId(pessoa['principal']);
      });
    }
  }

  ngOnInit() {
  }

  async getQuestRespAnaliticaPessoaId(idPessoa) {
    const retorno = await this.connectHTTP.callService({
      service: 'getQuestRespAnaliticaPessoaId',
      paramsService: { idPessoa }
    }) as any;
    if (retorno.resposta.length && retorno.resposta[0].id) {
      this.questRespAnalitica = retorno.resposta;
    }
  }

  async getQuestariosPessoaId(pessoa: any) {
    // return;
    const retorno = await this.connectHTTP.callService({
      service: 'getQuestariosPessoaId',
      paramsService: { idPessoa: pessoa.id }
    }) as any;
    debugger
    if (retorno.resposta.length && retorno.resposta[0].id) {
      this.questRespAnalitica = retorno.resposta;
    }
  }
}
