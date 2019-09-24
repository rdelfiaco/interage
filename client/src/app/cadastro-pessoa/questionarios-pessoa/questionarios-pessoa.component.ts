import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
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
  constructor(
    private connectHTTP: ConnectHTTP,
  ) { }

  ngOnInit() {
    debugger
    this.getQuestariosPessoaId();
  }

  async getQuestRespAnaliticaPessoaId(idPessoa) {
    const retorno = await this.connectHTTP.callService({
      service: 'getQuestRespAnaliticaPessoaId',
      paramsService: { idPessoa }
    }) as any;
    return retorno.resposta;
  }

  async getQuestariosPessoaId() {
    debugger
    return;
    const retorno = await this.connectHTTP.callService({
      service: 'getQuestariosPessoaId',
      paramsService: { idPessoa: this.pessoa['id'] }
    }) as any;
    return retorno.resposta;
  }
}
