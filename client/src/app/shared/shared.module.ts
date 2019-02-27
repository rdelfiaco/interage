import { Valida } from './services/valida';
import { ConnectHTTP } from './services/connectHTTP';
import { LocalStorage } from './services/localStorage';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


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
    Valida

  ]
})
export class SharedModule { }
