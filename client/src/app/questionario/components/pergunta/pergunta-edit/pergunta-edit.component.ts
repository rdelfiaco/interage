import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ConnectHTTP } from '../../../../shared/services/connectHTTP';
import { LocalStorage } from '../../../../shared/services/localStorage';
import { ToastService } from '../../../../../lib/ng-uikit-pro-standard';

@Component({
  selector: 'app-pergunta-edit',
  templateUrl: './pergunta-edit.component.html',
  styleUrls: ['./pergunta-edit.component.scss']
})
export class PerguntaEditComponent implements OnInit {
  private questionarioForm: FormGroup;
  tableData: object = {
  };
  pergId = null;

  constructor(
    private router: Router,
    private _location: Location,
    private route: ActivatedRoute,
    private connectHTTP: ConnectHTTP,
    private toastrService: ToastService,
    private localStorage: LocalStorage,
  ) {
    this.route.params.subscribe(res => {
      debugger
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
      debugger;
      let data = respQuest.resposta[0];
      data.alternativas = respPergQuest.alternativas;
      this.tableData = data;
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes', e);
    }
  }

  goBack() {
    this._location.back();
  }

  openResposta(id: string) {
    this.router.navigate(['questionario/1/pergunta/11/resposta/' + id]);
  }


  async updatePergunta() {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'updatePergunta',
        paramsService: { data: JSON.stringify({ 
          id:this.pergId,
          nome: this.tableData['nome'],
          sequencia: this.tableData['sequencia_pergunta'],
        })}
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

  async apagarPergunta() {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'deletePergunta',
        paramsService: { id: this.pergId }
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
  
  async apagarAlternativa(id) {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'deleteAlternativa',
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

  async updateStatusAlternativa(id, status) {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'updateStatusAlternativa',
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
}
