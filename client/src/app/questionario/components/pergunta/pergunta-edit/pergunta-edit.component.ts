import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ConnectHTTP } from '../../../../shared/services/connectHTTP';
import { LocalStorage } from '../../../../shared/services/localStorage';
import { ToastService, ModalDirective } from '../../../../../lib/ng-uikit-pro-standard';

@Component({
  selector: 'app-pergunta-edit',
  templateUrl: './pergunta-edit.component.html',
  styleUrls: ['./pergunta-edit.component.scss']
})
export class PerguntaEditComponent implements OnInit {
  novaAlternativa = {
    nome: '',
    status: false,
    sequencia: '',
    proximaPerguntaId: ''
  };

  tableData = {
    id: '',
    alternativas: [{}],
    id_questionario: '',
    nome:'',
    status: false,
    sequencia_pergunta: '',
    descricao_pergunta: '',
    multipla_escolha: ''
  };
  pergId = null;
  @ViewChild('alternativaadd') alternativaadd: ModalDirective;
  sorted = false;

  constructor(
    private router: Router,
    private _location: Location,
    private route: ActivatedRoute,
    private connectHTTP: ConnectHTTP,
    private toastrService: ToastService,
    private localStorage: LocalStorage,
  ) {
    this.route.params.subscribe(res => {

      this.pergId = res.id;
    });
  }

  ngOnInit() {
    this.getDataPergunta()
  }

  async getDataPergunta() {
    try {
      let respQuest = await this.connectHTTP.callService({
        service: 'getPerguntaById',
        paramsService: { id: this.pergId }
      }) as any;
      let respPergQuest = await this.connectHTTP.callService({
        service: 'getAlternativasByIdPerguntas',
        paramsService: { id: this.pergId }
      }) as any;
      if (respQuest.error) {
        return this.toastrService.error(respQuest.error);
      }
      if (respPergQuest.error) {
        return this.toastrService.error(respPergQuest.error);
      }
      ;
      let data = respQuest.resposta[0];
      if (respPergQuest.resposta[0] && respPergQuest.resposta[0].id)
        data.alternativas = respPergQuest.resposta;
      this.tableData = data;
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 31', e);
    }
  }

  goBack() {
    this._location.back();
  }

  openAlternativa(id: string) {
    this.router.navigate(['questionario/1/pergunta/11/alternativa/' + id]);
  }


  async updatePergunta() {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'updatePergunta',
        paramsService: {
          data: JSON.stringify({
            id: this.pergId,
            nome: this.tableData.nome,
            sequencia_pergunta: this.tableData.sequencia_pergunta,
            descricao_pergunta: this.tableData.descricao_pergunta,
          })
        }
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Alterado com sucesso');
        this.goBack();
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 32', e);
    }
  }

  async apagarPergunta() {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'deletePergunta',
        paramsService: { id: this.pergId }
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Apagado com sucesso');
        this.goBack();
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 33', e);
    }
  }

  async apagarAlternativa(id) {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'deleteAlternativa',
        paramsService: { id }
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Apagado com sucesso');
        this.getDataPergunta();
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 34', e);
    }
  }

  async updateStatusAlternativa(id, status) {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'updateStatusAlternativa',
        paramsService: { data: JSON.stringify({ id, status: !status }) }
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Status alterado com sucesso');
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 35', e);
    }
  }

  async updateStatusPergunta(id) {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'updateStatusPergunta',
        paramsService: { data: JSON.stringify({ id, status: !this.tableData.status }) }
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Status alterado com sucesso');
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 36', e);
    }
  }

  async updateMultiEscolhaPergunta(id) {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'updateMultiEscolhaPergunta',
        paramsService: { data: JSON.stringify({ id, multi_escolha: !this.tableData.multipla_escolha }) }
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Alterado com sucesso');
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 37', e);
    }
  }

  async salvarAlternativa() {
    try {
      let perguntaId = this.pergId;

      let resp = await this.connectHTTP.callService({
        service: 'addAlternativa',
        paramsService: {
          data: JSON.stringify({
            ...this.novaAlternativa,
            perguntaId,
          })
        }
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Salvo com sucesso');
        this.getDataPergunta();
        this.alternativaadd.hide();
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 38', e);
    }
  }

  sortBy(by: string | any): void {
    this.tableData.alternativas.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }

      return 0;
    });

    this.sorted = !this.sorted;
  }
}
