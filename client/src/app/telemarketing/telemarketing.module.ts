import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemarketingComponent } from './telemarketing.component';
import { TelemarketingQuestionarioModule } from '../telemarketing-questionario/telemarketing-questionario.module';
import { MDBBootstrapModulesPro, ToastModule } from '../../lib/ng-uikit-pro-standard';
import { CadastroPessoaModule } from '../cadastro-pessoa/cadastro-pessoa.module';

@NgModule({
  imports: [
    CommonModule,
    TelemarketingQuestionarioModule,
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot(),
    CadastroPessoaModule
  ],
  declarations: [TelemarketingComponent],
  exports: [TelemarketingComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class TelemarketingModule { }
