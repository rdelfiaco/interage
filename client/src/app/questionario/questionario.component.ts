import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { ToastService } from '../../lib/ng-uikit-pro-standard';
import { LocalStorage } from '../shared/services/localStorage';

@Component({
  selector: 'app-questionario',
  templateUrl: './questionario.component.html',
  styleUrls: ['./questionario.component.scss']
})
export class QuestionarioComponent implements OnInit {

  tableData: object[] = [];

  private sorted = false;

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
    debugger
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
      debugger
      this.toastrService.error('Erro ao ler as permissoes de questionário', e);
    }
  }

  async deleteQuestionario(id) {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'deleteQuestionario',
        paramsService: { id }
      }) as any;
      debugger;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Quationário apagado com sucesso');
        this.getQuestionarios();
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes do departamento', e);
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
}
