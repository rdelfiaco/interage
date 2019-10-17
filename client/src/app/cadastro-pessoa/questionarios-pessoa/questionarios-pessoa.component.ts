import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import * as moment from 'moment';

@Component({
  selector: 'app-questionarios-pessoa',
  templateUrl: './questionarios-pessoa.component.html',
  styleUrls: ['./questionarios-pessoa.component.scss']
})
export class QuestionariosPessoaComponent implements OnInit {
  @Output() refresh = new EventEmitter();
  @Input() pessoa: Observable<string[]>;
  questRespAnalitica: any = [];
  questionarioSelecionado = {
    id: null,
    nome: '',
    data: '',
    respostas: []
  };
  constructor(
    private connectHTTP: ConnectHTTP,
  ) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['pessoa'] && this.pessoa) {
      this.pessoa.subscribe(pessoa => {
        this.getQuestariosPessoaId(pessoa['principal']);
      });
    }
  }

  ngOnInit() {
  }

  selectQuest(item) {
    this.questionarioSelecionado = item;
  }

  getObs(obs) {
    if (new Date(obs).toString() == 'Invalid Date') {
      return obs;
    }
    return moment(new Date(obs)).format('DD/MM/YYYY');
  }

  async getQuestariosPessoaId(pessoa: any) {
    const retorno = await this.connectHTTP.callService({
      service: 'getQuestariosPessoaId',
      paramsService: { idPessoa: pessoa.id }
    }) as any;
    if (retorno.resposta.length && retorno.resposta[0].id) {
      retorno.resposta.forEach(resp => {
        if (!this.questRespAnalitica.some(q => q.id === resp.id_questionario)) {
          this.questRespAnalitica.push({
            id: resp.id_questionario,
            nome: resp.nome_questionario,
            data: moment(resp.dt_resposta).format('DD/MM/YYYY'),
            respostas: []
          });
        }
        this.questRespAnalitica.forEach(quest => {
          if (resp.id_questionario === quest.id) {
            quest.respostas.push({
              nome: resp.pergunda,
              alternativa: resp.alternativa,
              observacao: resp.observacao
            });
          }
        });
      });
    }
  }
}
