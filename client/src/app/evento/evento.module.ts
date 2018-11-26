import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoComponent } from './evento.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModulesPro } from '../../lib/ng-uikit-pro-standard';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetalheEventoComponent } from './detalhe-evento/detalhe-evento.component';
import { CarregandoModule } from '../shared/carregando/carregando.module';
import { LinhaDoTempoEventoComponent } from './linha-do-tempo-evento/linha-do-tempo-evento.component';
import { ItemLinhaDoTempoEventoComponent } from './item-linha-do-tempo-evento/item-linha-do-tempo-evento.component';
import { FormularioEventoComponent } from './formulario-evento/formulario-evento.component';
import { SemPermissaoModule } from '../sem-permissao/sem-permissao.module';
import { ConcluirEventoComponent } from './concluir-evento/concluir-evento.component';
import { TelemarketingQuestionarioModule } from '../telemarketing-questionario/telemarketing-questionario.module';
import { CadastroPessoaModule } from '../cadastro-pessoa/cadastro-pessoa.module';
import { CriarEventoComponent } from './criar-evento/criar-evento.component';
import { EncaminharEventoComponent } from './encaminhar-evento/encaminhar-evento.component';
import { PesquisaClienteModule } from '../pesquisa-cliente/pesquisa-cliente.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    MDBBootstrapModulesPro,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CarregandoModule,
    SemPermissaoModule,
    TelemarketingQuestionarioModule,
    CadastroPessoaModule,
    PesquisaClienteModule
  ],
  providers: [

  ],
  declarations: [
    EventoComponent,
    DetalheEventoComponent,
    LinhaDoTempoEventoComponent,
    ItemLinhaDoTempoEventoComponent,
    FormularioEventoComponent,
    ConcluirEventoComponent,
    CriarEventoComponent,
    EncaminharEventoComponent
  ]
})
export class EventoModule { }
