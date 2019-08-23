import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { ToastService, ModalDirective } from '../../lib/ng-uikit-pro-standard';
import { LocalStorage } from '../shared/services/localStorage';

@Component({
  selector: 'app-questionario',
  templateUrl: './questionario.component.html',
  styleUrls: ['./questionario.component.scss']
})
export class QuestionarioComponent implements OnInit {
  data = {
    nome: '',
    status: true
  }
  tableData: any = [];

  sorted = false;
  @ViewChild('questionarioadd') modalquestionario: ModalDirective;

  constructor(
    private router: Router,
    private connectHTTP: ConnectHTTP,
    private toastrService: ToastService,
    private localStorage: LocalStorage) { }

  ngOnInit() {
    this.getQuestionarios();
  }

  sortBy(by: string | any): void {
    this.tableData.sort((a: any, b: any) => {
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

  openQuestionario(id: string) {
    
    this.router.navigate(['questionario/' + id]);
  }


  async getQuestionarios() {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'getQuestionarios',
        paramsService: {}
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.tableData = resp.resposta;
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes de questionário 4', e);
    }
  }

  async deleteQuestionario(id) {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'deleteQuestionario',
        paramsService: { id }
      }) as any;
      ;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Quationário apagado com sucesso');
        this.getQuestionarios();
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 3', e);
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
      this.toastrService.error('Erro ao ler as permissoes 2', e);
    }
  }


  async salvarQuestionario() {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'addQuestionario',
        paramsService: { data: JSON.stringify({nome: this.data.nome, status:this.data.status})}
      }) as any;
      ;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Quationário salvo com sucesso');
        this.modalquestionario.hide();
        this.getQuestionarios();
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes 1', e);
    }
  }
}
