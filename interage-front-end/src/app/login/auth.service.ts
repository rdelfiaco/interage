import { Usuario } from './usuario';

import { Injectable } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  async autenticacao(usuario: Usuario) {
    const usuarioLogado = await new ConnectHTTP().callService()
    new LocalStorage().postLocalStorage('usuarioLogado', usuarioLogado)
  }

  constructor() { }
}