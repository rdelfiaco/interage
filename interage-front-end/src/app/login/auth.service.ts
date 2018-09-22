import { Usuario } from './usuario';


import { Injectable } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  autenticacao (usuario: Usuario) {

    debugger

    new ConnectHTTP().callService()

  }


  constructor() { }



}
