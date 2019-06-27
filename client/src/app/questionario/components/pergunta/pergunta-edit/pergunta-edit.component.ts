import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pergunta-edit',
  templateUrl: './pergunta-edit.component.html',
  styleUrls: ['./pergunta-edit.component.scss']
})
export class PerguntaEditComponent implements OnInit {
  private questionarioForm: FormGroup;
  tableData: object = {
    nome: "Gostou do atendimento?", 
    alternativas: [
      {
        id: 111,
        titulo: 'SIM',
        status: 1,
        sequencia: 1
      },
      {
        id: 122,
        titulo: 'NÃO',
        status: 1,
        sequencia: 2
      }
    ],
    sequencia: 1,
    status: 1
  };
  constructor(private router: Router,private _location: Location,) { }

  ngOnInit() {
  }


  goBack() {
    this._location.back();
  }

  openResposta(id: string) {
    this.router.navigate(['questionario/1/pergunta/11/resposta/'+id]);
  }
}