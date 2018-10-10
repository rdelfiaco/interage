import { Usuario } from './usuario';

import { Injectable } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage'
import { Router } from '@angular/router';
import { Observable, Subscriber, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioLogado: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!this._getTokenLogadoLocalStorage());
  usuarioLogadoObject: any;

  constructor(private router: Router, private localStorage: LocalStorage) {
    let self = this;
    let tm;
    document.addEventListener("mousemove", () => {
      if (tm) clearTimeout(tm);
      tm = setTimeout(() => {
        self.validaAutenticacao();
      }, 1000 * 5)
    });
  }

  estaLogado(): Observable<boolean> {
    return this.usuarioLogado.asObservable();
  }

  async autenticacao(usuario: Usuario) {
    try {
      const usuarioLogado = await new ConnectHTTP().callService({
        service: 'login',
        paramsService: {
          login: usuario.login,
          senha: usuario.senha
        }
      })
      this.usuarioLogadoObject = usuarioLogado.resposta;
      this.localStorage.postLocalStorage('usuarioLogado', usuarioLogado.resposta)
      this._setValidadeToken();

      this.usuarioLogado.next(true)
      return usuarioLogado;
    }
    catch (e) {
      return e;
    }
  }

  checkAutenticacao() {
    return this._getDataExpiracao() && this._getDataExpiracao().getTime() > new Date().getTime();
  }

  validaAutenticacao() {
    if (this._getDataExpiracao().getTime() > new Date().getTime()) {
      this._setValidadeToken();
    }
  }

  _getDataExpiracao(): Date {
    if (this.usuarioLogadoObject && this.usuarioLogadoObject.token)
      return this.localStorage.getLocalStorage(this.usuarioLogadoObject.token as string) as Date;
  }
  _setValidadeToken() {
    let validadeToken = new Date(new Date().getTime() + (1000 * 60 * 30))
    if (this.usuarioLogadoObject && this.usuarioLogadoObject.token)
      this.localStorage.postLocalStorage(this.usuarioLogadoObject.token, validadeToken)
  }

  async logout() {
    let usuarioLogado = this._getUsuarioLogadoLocalStorage();
    if (!usuarioLogado) return;
    await new ConnectHTTP().callService({
      service: 'logout',
      paramsService: {
        token_access: usuarioLogado.token
      }
    })
    
    this.localStorage.delLocalStorage(`${usuarioLogado.token}_date`)
    this.localStorage.delLocalStorage('usuarioLogado_object')
    this.usuarioLogado.next(false);
    this.router.navigate(['/']);
    // window.location.reload();
  }

  _getUsuarioLogadoLocalStorage() {
    return this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
  }

  _getTokenLogadoLocalStorage() {
    if (!this.usuarioLogadoObject) this.usuarioLogadoObject = this._getUsuarioLogadoLocalStorage();
    if (this.usuarioLogadoObject)
      return this.localStorage.getLocalStorage(this.usuarioLogadoObject.token);
  }
}