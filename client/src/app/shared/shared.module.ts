import { BancoDados } from './services/bancoDados';
import { Valida } from './services/valida';
import { ConnectHTTP } from './services/connectHTTP';
import { LocalStorage } from './services/localStorage';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckPermissaoRecurso } from './services/checkPemissaoRecurso';
import { CnpjPipe } from './pipes/validaCnpj/cnpj.pipe';
import { CpfPipe } from './pipes/validaCpf/cpf.pipe';
import { ResponderQuestionarioComponent } from '../responder-questionario/responder-questionario.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    //LocalStorage, 
    //ConnectHTTP
    CnpjPipe,
    CpfPipe,
    ResponderQuestionarioComponent
  ],
  exports: [
    ResponderQuestionarioComponent
  ],
  providers: [
    LocalStorage,
    ConnectHTTP,
    Valida,
    CheckPermissaoRecurso,
    BancoDados,

  ]
})
export class SharedModule { }
