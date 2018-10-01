import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { Usuario } from '../login/usuario';
import { Observable, Observer, Subscriber } from 'rxjs';

@Component({
  selector: 'app-cadastro-pessoa',
  templateUrl: './cadastro-pessoa.component.html',
  styleUrls: ['./cadastro-pessoa.component.scss']
})
export class CadastroPessoaComponent implements OnInit {

  private _pessoa;
  observerPessoa: Subscriber<object>;
  @Output() refresh = new EventEmitter();
  @Input()
  set pessoa(pessoa: Observable<object>) {
    if (pessoa) this._pessoa = pessoa;
  }

  get pessoa(): any {
    return this._pessoa
  }

  constructor(private connectHTTP: ConnectHTTP, private localStorage: LocalStorage) {

  }

  ngOnInit() {
  }

  refreshDad() {

    this.refresh.emit();
  }
}
