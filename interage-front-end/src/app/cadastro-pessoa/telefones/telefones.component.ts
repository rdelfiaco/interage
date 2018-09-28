import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-telefones',
  templateUrl: './telefones.component.html',
  styleUrls: ['./telefones.component.scss']
})
export class TelefonesComponent implements OnInit {
  tipoTelefone: Array<object> = [
    {
      value: '1',
      label: 'Celular'
    },
    {
      value: '2',
      label: "Comercial"
    },
    {
      value: '3',
      label: "Comercial 2"
    },
    {
      value: '4',
      label: "Recado"
    },
    {
      value: '5',
      label: "Residencial"
    },
    {
      value: '6',
      label: "Rural"
    }
  ]
  constructor() { }

  ngOnInit() {
  }

}
