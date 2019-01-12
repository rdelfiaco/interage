import { Usuario } from './usuario';

import { Injectable } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage'
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioLogado: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!this._getTokenLogadoLocalStorage());
  counterEvents: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  usuarioLogadoObject: any;
  setInterval: any;
  config: any;

  constructor(private router?: Router, private localStorage?: LocalStorage, private connectHTTP?: ConnectHTTP) {
    let self = this;
    let tm;
    this.initConfig();
    document.addEventListener("mousemove", () => {
      if (tm) clearTimeout(tm);
      tm = setTimeout(() => {
        self.validaAutenticacao();
      }, 1000 * 5)
    });
  }

  async getCounterEvents() {
    return this.counterEvents;
  }

  async initConfig() {
    let config = await this.connectHTTP.callService({
      service: 'getConfiguracao',
      paramsService: {
        nomeConfiguracao: "tempoDeAlertaDeEventos"
      }
    }) as any;
    this.config = config.resposta[0].valor;
    this.ativaGetEventos(parseInt(config));
  }

  async ativaGetEventos(timer: number) {
    let self = this;
    let res = await self.connectHTTP.callService({
      service: 'getCountEventosPendentes',
      paramsService: {
        idUsuarioLogado: self.usuarioLogadoObject.id
      }
    }) as any;
    let counter = res.resposta[0].count as number;
    this.counterEvents.next(counter);

    this.setInterval = setInterval(async () => {
      if (!self.usuarioLogadoObject) return clearInterval(self.setInterval);

      let res = await self.connectHTTP.callService({
        service: 'getCountEventosPendentes',
        paramsService: {
          idUsuarioLogado: self.usuarioLogadoObject.id
        }
      }) as any;
      let counter = res.resposta[0].count as number;
      this.counterEvents.next(counter);
    }, timer)
  }
  estaLogado(): Observable<boolean> {
    return this.usuarioLogado.asObservable();
  }

  async autenticacao(usuario: Usuario) {
    try {
      const usuarioLogado = await this.connectHTTP.callService({
        service: 'login',
        naoExigeToken: true,
        paramsService: {
          login: usuario.login,
          senha: usuario.senha
        }
      })
      this.usuarioLogadoObject = usuarioLogado.resposta;
      this.localStorage.postLocalStorage('usuarioLogado', usuarioLogado.resposta)
      this._setValidadeToken();
      this.ativaGetEventos(this.config);

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
    else {
      this.logout();
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
    let usuarioLogado = this.getUsuarioLogadoLocalStorage();
    if (!usuarioLogado) return;
    await this.connectHTTP.callService({
      service: 'logout',
      naoExigeToken: true,
      paramsService: {
        token: usuarioLogado.token,
        id_usuario: usuarioLogado.id
      }
    })
    this.counterEvents.next(0);
    this.localStorage.delLocalStorage(`${usuarioLogado.token}_date`)
    this.localStorage.delLocalStorage('usuarioLogado_object')
    this.usuarioLogado.next(false);
    this.usuarioLogadoObject = null;
    this.router.navigate(['/']);
  }

  getUsuarioLogadoLocalStorage() {
    return this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
  }

  _getTokenLogadoLocalStorage() {
    if (!this.usuarioLogadoObject) this.usuarioLogadoObject = this.getUsuarioLogadoLocalStorage();
    if (this.usuarioLogadoObject)
      return this.localStorage.getLocalStorage(this.usuarioLogadoObject.token);
  }
}