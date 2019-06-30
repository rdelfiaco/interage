import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
      this.toastrService.error('Erro ao ler as permissoes do departamento', e);
    }
  }
}
