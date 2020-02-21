import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastService, ModalDirective } from '../../../lib/ng-uikit-pro-standard';

@Component({
  selector: 'app-questionario-edit',
  templateUrl: './questionario-edit.component.html',
  styleUrls: ['./questionario-edit.component.scss']
})
export class QuestionarioEditComponent implements OnInit {
  idQuest = "";
  @Input() tableData: any = {};
  usuarioLogado: any;
  novaPergunta = {
    nome: '',
    status: true,
    sequencia: '',
    multipla_escolha: false,
    descricao: '',
    tipo_pergunta: 1
  };
  private sorted = false;
  tiposPergunta = [
    {
      value: 1,
      label: 'Objetiva'
    },
    {
      value: 2,
      label: 'Múltipla-escolha'
    },
    {
      value: 3,
      label: 'Discursiva'
    },
    {
      value: 4,
      label: 'Data'
    },
  ];

  @ViewChild('perguntaadd') modalperguntaadd: ModalDirective;

  constructor(
    private _location: Location,
    private router: Router,
    private connectHTTP: ConnectHTTP,
    private toastrService: ToastService,
    private route: ActivatedRoute,
    private localStorage: LocalStorage) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;
    this.route.params.subscribe(res => {
      this.idQuest = res.id;
    });
  }

  getDecricaoTipo(tipo) {
    if (!tipo) return '-';
    const res = this.tiposPergunta.filter(t => t.value === tipo)[0];
    return res.label || '-';
  }

  ngOnInit() {
    this.getDataQuestionario();
  }

  goBack() {
    this._location.back();
  }

  openPergunta(id: string) {
    this.router.navigate(['questionario/1/pergunta/' + id]);
  }

  async getDataQuestionario() {
    try {
      let respQuest = await this.connectHTTP.callService({
        service: 'getQuestionarioById',
        paramsService: { id: this.idQuest }
      }) as any;
      if (respQuest.error) {
        return this.toastrService.error(respQuest.error);
      }
      let data = (respQuest.resposta || {}).questionario['0'];
      data.perguntas = (respQuest.resposta || {}).perguntas;
      this.tableData = data;
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 17', e);
    }
  }

  async updateQuestionario(id) {
    try {
      let nome = document.querySelector('#nome')['value'];
      let resp = await this.connectHTTP.callService({
        service: 'updateQuestionario',
        paramsService: { data: JSON.stringify({ id, nome }) }
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Alterado com sucesso');
        this.goBack();
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 16', e);
    }
  }


  async updateStatusQuestionario(id, status) {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'updateStatusQuestionario',
        paramsService: { data: JSON.stringify({ id, status: !status }) }
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Status alterado com sucesso');
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 15', e);
    }
  }

  async updateStatusPergunta(id, status) {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'updateStatusPergunta',
        paramsService: { data: JSON.stringify({ id, status: !status }) }
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Status alterado com sucesso');
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 14', e);
    }
  }

  async updateMultiEscolhaPergunta(id, multi_escolha) {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'updateMultiEscolhaPergunta',
        paramsService: { data: JSON.stringify({ id, multi_escolha: !multi_escolha }) }
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Alterado com sucesso');
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 13', e);
    }
  }

  async apagarQuestionario() {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'deleteQuestionario',
        paramsService: { id: this.tableData.id }
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Quationário apagado com sucesso');
        this.goBack();
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 12', e);
    }
  }

  async apagarPergunta(id) {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'deletePergunta',
        paramsService: { id }
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Apagado com sucesso');
        this.getDataQuestionario();
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 11', e);
    }
  }

  sortBy(by: string | any): void {
    this.tableData.perguntas.sort((a: any, b: any) => {
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


  async salvarPergunta() {
    try {
      let questionarioId = this.idQuest;
      let resp = await this.connectHTTP.callService({
        service: 'addPergunta',
        paramsService: {
          data: JSON.stringify({ ...this.novaPergunta, questionarioId })
        }
        }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Salvo com sucesso');
        this.modalperguntaadd.hide();
        this.getDataQuestionario();
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 18', e);
    }
  }

  getSelectedValue(data) {
    this.novaPergunta.tipo_pergunta = data.value;
    return data;
  }
}
