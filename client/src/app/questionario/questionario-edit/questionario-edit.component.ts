import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-questionario-edit',
  templateUrl: './questionario-edit.component.html',
  styleUrls: ['./questionario-edit.component.scss']
})
export class QuestionarioEditComponent implements OnInit {
  private questionarioForm: FormGroup;
  tableData: object = {
    nome: "Quest. Avaliação de Pós Venda", 
    perguntas: [
      {
        id:11,
        nome: 'Gostou do atendimento?',
        qtd_respostas: 5,
        status: 0,
        sequencia: 1
      }
    ],
    status: 1
  };
  usuarioLogado: any;

  constructor(
    private _location: Location,
    private router: Router,
    private connectHTTP: ConnectHTTP,
    private formBuilder: FormBuilder,
    private localStorage: LocalStorage) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;
  }

  ngOnInit() {
  }

  goBack() {
    this._location.back();
  }

  openPergunta(id: string) {
    this.router.navigate(['questionario/1/pergunta/'+id]);
  }
}
