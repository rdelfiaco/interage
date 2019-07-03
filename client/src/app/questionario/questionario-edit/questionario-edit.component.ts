import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';

@Component({
  selector: 'app-questionario-edit',
  templateUrl: './questionario-edit.component.html',
  styleUrls: ['./questionario-edit.component.scss']
})
export class QuestionarioEditComponent implements OnInit {
  // private questionarioForm: FormGroup;
  idQuest= "";
  @Input() tableData: any = {};
  //   nome: "Quest. Avaliação de Pós Venda", 
  //   perguntas: [
  //     {
  //       id:11,
  //       nome: 'Gostou do atendimento?',
  //       qtd_respostas: 5,
  //       status: 0,
  //       sequencia: 1
  //     }
  //   ],
  //   status: 1
  // };
  usuarioLogado: any;

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

  ngOnInit() {
    this.getDataQuestionario();
  }

  goBack() {
    this._location.back();
  }

  openPergunta(id: string) {
    this.router.navigate(['questionario/1/pergunta/'+id]);
  }

  async getDataQuestionario() {
    try {
      let respQuest = await this.connectHTTP.callService({
        service: 'getQuestionarioById',
        paramsService: {id: this.idQuest}
      }) as any;
      let respPergQuest = await this.connectHTTP.callService({
        service: 'getPerguntasByIdUqestionario',
        paramsService: {id: this.idQuest}
      }) as any;
      if (respQuest.error) {
        return this.toastrService.error(respQuest.error);
      }
      if (respPergQuest.error) {
        return this.toastrService.error(respPergQuest.error);
      }
      let data = respQuest.resposta[0];
      data.perguntas = respPergQuest.resposta;
      this.tableData = data;
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes', e);
    }
  }

  async updateQuestionario() {
    try {
      let nome = document.querySelector('#nome')['value'];
      let resp = await this.connectHTTP.callService({
        service: 'updateQuestionario',
        paramsService: { data: JSON.stringify({ id:this.tableData.id, nome })}
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Status alterado com sucesso');
        this.goBack();
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes', e);
    }
  }


  async updateStatusQuestionario(id, status) {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'updateStatusQuestionario',
        paramsService: { data: JSON.stringify({ id, status: !status })}
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Status alterado com sucesso');
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes', e);
    }
  }

  async updateStatusPergunta(id, status) {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'updateStatusPergunta',
        paramsService: { data: JSON.stringify({ id, status: !status })}
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Status alterado com sucesso');
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes', e);
    }
  }

  async updateMultiEscolhaPergunta(id, multi_escolha) {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'updateMultiEscolhaPergunta',
        paramsService: { data: JSON.stringify({ id, multi_escolha: !multi_escolha })}
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Alterado com sucesso');
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes', e);
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
      this.toastrService.error('Erro ao ler as permissoes do departamento', e);
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
        this.toastrService.success('Quationário apagado com sucesso');
        this.goBack();
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes do departamento', e);
    }
  }
}
