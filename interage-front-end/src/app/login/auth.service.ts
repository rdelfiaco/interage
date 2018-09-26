import { Usuario } from './usuario';

import { Injectable } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  async autenticacao(usuario: Usuario) {
    try {
      const usuarioLogado = await new ConnectHTTP().callService({
        service: 'login',
        paramsService: {
          login: usuario.login,
          senha: usuario.senha
        }
      })
      new LocalStorage().postLocalStorage('usuarioLogado', usuarioLogado.resposta)
      this._setValidadeToken(usuarioLogado.resposta as Usuario);
      return usuarioLogado;
    }
    catch (e) {
      return e;
    }
  }
  checkAutenticacao() {
    if (this._getDataExpiracao() && this._getDataExpiracao().getTime() > new Date().getTime()) return true;
  }

  validaAutenticacao() {
    if (this._getDataExpiracao().getTime() > new Date().getTime()) {
      let usuarioLogado = new LocalStorage().getLocalStorage('usuarioLogado') as Usuario;
      this._setValidadeToken(usuarioLogado);
    }
  }

  _getDataExpiracao(): Date {
    let usuarioLogado = new LocalStorage().getLocalStorage('usuarioLogado') as Usuario;
    if (usuarioLogado && usuarioLogado.token)
      return new LocalStorage().getLocalStorage(usuarioLogado.token as string) as Date;
  }
  _setValidadeToken(usuarioLogado: Usuario) {
    let validadeToken = new Date(new Date().getTime() + (1000 * 60 * 30))
    if (usuarioLogado && usuarioLogado.token)
      new LocalStorage().postLocalStorage(usuarioLogado.token, validadeToken)
  }

  constructor() { }
}