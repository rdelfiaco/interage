import { CriarEventoComponent } from './criar-evento/criar-evento.component';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoComponent } from './evento.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModulesPro, SelectModule, WavesModule } from '../../lib/ng-uikit-pro-standard';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetalheEventoComponent } from './detalhe-evento/detalhe-evento.component';
import { CarregandoModule } from '../shared/carregando/carregando.module';
import { LinhaDoTempoEventoComponent } from './linha-do-tempo-evento/linha-do-tempo-evento.component';
import { ItemLinhaDoTempoEventoComponent } from './item-linha-do-tempo-evento/item-linha-do-tempo-evento.component';
import { SemPermissaoModule } from '../sem-permissao/sem-permissao.module';
import { ConcluirEventoComponent } from './concluir-evento/concluir-evento.component';
import { TelemarketingQuestionarioModule } from '../telemarketing-questionario/telemarketing-questionario.module';
import { CadastroPessoaModule } from '../cadastro-pessoa/cadastro-pessoa.module';
import { PesquisaClienteModule } from '../pesquisa-cliente/pesquisa-cliente.module';
import { FormularioEventoModule } from './formulario-evento/formulario-evento.module';
import { ConcluirEventoModule } from './concluir-evento/concluir-evento.module';
import { EncaminharEventoModule } from './encaminhar-evento/encaminhar-evento.module';
import { CriarEventoModule } from './criar-evento/criar-evento.module';
import { LinhaDoTempoModule } from '../linha-do-tempo/linha-do-tempo.module';


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    MDBBootstrapModulesPro,
    SelectModule,
    WavesModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CarregandoModule,
    SemPermissaoModule,
    TelemarketingQuestionarioModule,
    CadastroPessoaModule,
    FormularioEventoModule,
    ConcluirEventoModule,
    EncaminharEventoModule,
    CriarEventoModule,
    LinhaDoTempoModule
  ],
  providers: [

  ],
  declarations: [
    EventoComponent,
    DetalheEventoComponent,
    LinhaDoTempoEventoComponent,
    ItemLinhaDoTempoEventoComponent
  ],
  exports: [
    EventoComponent,
    DetalheEventoComponent,
    LinhaDoTempoEventoComponent,
    ItemLinhaDoTempoEventoComponent,
    ConcluirEventoComponent,
    CriarEventoComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class EventoModule { }
