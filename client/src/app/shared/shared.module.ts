import { Valida } from './services/valida';
import { ConnectHTTP } from './services/connectHTTP';
import { LocalStorage } from './services/localStorage';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckPermissaoRecurso } from './services/checkPemissaoRecurso';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    //LocalStorage, 
    //ConnectHTTP
  ],
  providers: [
    LocalStorage,
    ConnectHTTP,
    Valida,
    CheckPermissaoRecurso

  ]
})
export class SharedModule { }
