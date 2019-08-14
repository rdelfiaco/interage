import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { ToastService } from '../../lib/ng-uikit-pro-standard';
import { LocalStorage } from '../shared/services/localStorage';
import { QuestionarioEditComponent } from '../questionario/questionario-edit/questionario-edit.component';

@Component({
  selector: 'app-responder-questionario',
  templateUrl: './responder-questionario.component.html',
  styleUrls: ['./responder-questionario.component.scss']
})
export class ResponderQuestionarioComponent implements OnInit {
  usuarioLogado: any;
  questionario: any = {};
  questId:any;

  constructor(
    private connectHTTP: ConnectHTTP,
    private toastrService: ToastService,
    private route: ActivatedRoute,
    private localStorage: LocalStorage) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;
    // this.route.params.subscribe(res => {
    //   this.idQuest = res.id;
    // });
  }

  ngOnInit() {
    this.getDataQuestionario();
  }

  async getDataQuestionario() {
    try {
      let respQuest = await this.connectHTTP.callService({
        service: 'getQuestionarioById',
        paramsService: { id: this.questId }
      }) as any;
      let respPergQuest = await this.connectHTTP.callService({
        service: 'getPerguntasByIdUqestionario',
        paramsService: { id: this.questId }
      }) as any;
      if (respQuest.error) {
        return this.toastrService.error(respQuest.error);
      }
      if (respPergQuest.error) {
        return this.toastrService.error(respPergQuest.error);
      }
      let data = respQuest.resposta[0];
      data.perguntas = respPergQuest.resposta;
      for (let index = 0; index < data.perguntas.length; index++) {
        const element = data.perguntas[index];
        let respAlterQuest = await this.connectHTTP.callService({
          service: 'getAlternativasByIdPerguntas',
          paramsService: { id: element.id }
        }) as any;
        element.alternativas = respAlterQuest.resposta;
      }
      debugger
      this.questionario = data;
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes', e);
    }
  }

}
