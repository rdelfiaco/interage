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
          login: usuario.login
        }
      })
      new LocalStorage().postLocalStorage('usuarioLogado', usuarioLogado)
      return usuarioLogado;
    }
    catch (e) {
      return e;
    }
  }

  constructor() { }
}