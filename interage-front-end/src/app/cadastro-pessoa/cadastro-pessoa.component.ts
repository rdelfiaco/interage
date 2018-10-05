import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { Usuario } from '../login/usuario';
import { Observable, Observer, Subscriber } from 'rxjs';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-cadastro-pessoa',
  templateUrl: './cadastro-pessoa.component.html',
  styleUrls: ['./cadastro-pessoa.component.scss']
})
export class CadastroPessoaComponent implements OnInit {

  private _pessoa;
  observerPessoa: Subscriber<object>;
  pessoaObject: any;
  @Output() refresh = new EventEmitter();
  @Input()
  set pessoa(pessoa: Observable<object>) {
    if (pessoa) this._pessoa = pessoa;
  }

  get pessoa(): any {
    return this._pessoa
  }

  constructor(private connectHTTP: ConnectHTTP, private localStorage: LocalStorage,
    private auth: AuthService) {

  }

  ngOnInit() {
  }

  refreshDad() {
    if (!this.pessoaObject)
      this.refresh.emit();
    else this.refreshPessoaAdd({ idPessoa: this.pessoaObject.principal.id });
  }

  async refreshPessoaAdd(p: any) {
    debugger;
    let pessoa = await this.connectHTTP.callService({
      service: 'getPessoa',
      paramsService: {
        token: this.auth.usuarioLogadoObject.token,
        id_usuario: this.auth.usuarioLogadoObject.id,
        id_pessoa: p.idPessoa
      }
    }) as any;
    this.pessoaObject = pessoa.resposta;
    this.pessoa = new Observable(o => o.next(pessoa.resposta));
  }
}
