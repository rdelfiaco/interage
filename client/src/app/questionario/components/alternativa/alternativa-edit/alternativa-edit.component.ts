import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ConnectHTTP } from '../../../../shared/services/connectHTTP';
import { ToastService } from '../../../../../lib/ng-uikit-pro-standard';
import { LocalStorage } from '../../../../shared/services/localStorage';

@Component({
  selector: 'app-alternativa-edit',
  templateUrl: './alternativa-edit.component.html',
  styleUrls: ['./alternativa-edit.component.scss']
})
export class AlternativaEditComponent implements OnInit {

  tableData = {
    id: '',
    id_pergunta: '',
    id_proxima_pergunta: '',
    nome: '',
    sequencia_alternativa: '',
    status: false,
  };
  alterId = null;

  constructor(
    private router: Router,
    private _location: Location,
    private route: ActivatedRoute,
    private connectHTTP: ConnectHTTP,
    private toastrService: ToastService,
    private localStorage: LocalStorage,
  ) {
    this.route.params.subscribe(res => {
      this.alterId = res.id;
    });
  }

  ngOnInit() {
    this.getDataAlternativa();
  }

  async getDataAlternativa() {
    try {
      let respQuest = await this.connectHTTP.callService({
        service: 'getAlternativaById',
        paramsService: { id: this.alterId }
      }) as any;
      if (respQuest.error) {
        return this.toastrService.error(respQuest.error);
      };
      let data = respQuest.resposta[0];
      this.tableData = data;
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 21', e);
    }
  }

  goBack() {
    this._location.back();
  }

  async updateAlternativa() {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'updateAlternativa',
        paramsService: {
          data: JSON.stringify({
            id: this.alterId,
            nome: this.tableData.nome,
            sequencia: this.tableData.sequencia_alternativa,
            proximaPerguntaId: this.tableData.id_proxima_pergunta,
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
      this.toastrService.error('Erro ao ler as permissoes 22', e);
    }
  }

  async apagarAlternativa() {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'deleteAlternativa',
        paramsService: { id: this.alterId }
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Apagado com sucesso');
        this.goBack();
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 23', e);
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
      this.toastrService.error('Erro ao ler as permissoes 24', e);
    }
  }
}
