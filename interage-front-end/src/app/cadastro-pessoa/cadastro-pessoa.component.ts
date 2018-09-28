import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cadastro-pessoa',
  templateUrl: './cadastro-pessoa.component.html',
  styleUrls: ['./cadastro-pessoa.component.scss']
})
export class CadastroPessoaComponent implements OnInit {

  private _pessoa;

  @Input()
  set pessoa(evento: any) {
    this._pessoa = evento;
  }

  get pessoa(): any {
    return this._pessoa
  }

  constructor() { }

  ngOnInit() {
  }

}
