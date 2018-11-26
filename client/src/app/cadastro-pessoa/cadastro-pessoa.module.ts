import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastroPessoaComponent } from './cadastro-pessoa.component';
import { PrincipalComponent } from './principal/principal.component';
import { TelefonesComponent } from './telefones/telefones.component';
import { EnderecosComponent } from './enderecos/enderecos.component';
import { MDBBootstrapModulesPro, ToastModule } from '../../lib/ng-uikit-pro-standard';
import { LinhaDoTempoModule } from '../linha-do-tempo/linha-do-tempo.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../shared/pipes/pipesModule';

@NgModule({
  imports: [
    CommonModule,
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot(),
    LinhaDoTempoModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule
  ],
  declarations: [
    CadastroPessoaComponent,
    PrincipalComponent,
    TelefonesComponent,
    EnderecosComponent,],
  exports: [
    CadastroPessoaComponent,
    PrincipalComponent,
    TelefonesComponent,
    EnderecosComponent,]
})
export class CadastroPessoaModule { }
