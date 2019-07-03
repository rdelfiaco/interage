import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { ToastService, ModalDirective } from '../../../lib/ng-uikit-pro-standard';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-questionario-add',
  templateUrl: './questionario-add.component.html',
  styleUrls: ['./questionario-add.component.scss']
})
export class QuestionarioAddComponent implements OnInit {
  // private questionarioForm: FormGroup;
  usuarioLogado: any;
  @Input() tableData = {
    nome: '',
    status: true
  };
  @ViewChild('questionarioadd') questionarioadd: ModalDirective;
  constructor(private router: Router,
    private _location: Location,
    private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private toastrService: ToastService) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;
  }

  ngOnInit() {
  }

  async salvarQuestionario() {
    try {
      let nome = document.querySelector('#nome')['value'];
      // let status = document.querySelector('#status input')['checked']
      let resp = await this.connectHTTP.callService({
        service: 'addQuestionario',
        paramsService: { data: JSON.stringify({nome, status:true})}
      }) as any;
      debugger;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Quationário salvo com sucesso');
        this.questionarioadd.hide();
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes do departamento', e);
    }
  }

  back() {
    this._location.back();
  }
}
