import { Component, OnInit, Input } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { Usuario } from '../login/usuario';

@Component({
  selector: 'app-cadastro-pessoa',
  templateUrl: './cadastro-pessoa.component.html',
  styleUrls: ['./cadastro-pessoa.component.scss']
})
export class CadastroPessoaComponent implements OnInit {

  private _pessoa;
  @Input() refresh: any
  @Input()
  set pessoa(evento: any) {
    this._pessoa = evento;
  }

  get pessoa(): any {
    return this._pessoa
  }

  constructor(private connectHTTP: ConnectHTTP, private localStorage: LocalStorage) {
  }

  ngOnInit() {
  }

}
