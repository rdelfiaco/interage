import { BancoDados } from './services/bancoDados';
import { Valida } from './services/valida';
import { ConnectHTTP } from './services/connectHTTP';
import { LocalStorage } from './services/localStorage';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckPermissaoRecurso } from './services/checkPemissaoRecurso';
import { ResponderQuestionario } from '../responder-questionario/responder-questionario.module';
import { RandomColor } from './services/randomColor';

@NgModule({
  imports: [
    CommonModule,
    ResponderQuestionario
  ],
  declarations: [
    //LocalStorage, 
    //ConnectHTTP
    // ResponderQuestionarioComponent
  ],
  exports: [
    ResponderQuestionario
  ],
  providers: [
    LocalStorage,
    ConnectHTTP,
    Valida,
    CheckPermissaoRecurso,
    BancoDados,
    RandomColor,
  ]
})
export class SharedModule { }
