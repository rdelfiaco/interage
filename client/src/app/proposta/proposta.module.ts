


import { ComunicaPropostaService } from './comunica-proposta.service';
import { Proposta } from './proposta';
import { PropostaComponent } from './proposta.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModulesPro } from '../../lib/ng-uikit-pro-standard';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PesquisaPlacaComponent } from './pesquisa-placa/pesquisa-placa.component';
import { PesquisaTabelaFipeComponent } from './pesquisa-tabela-fipe/pesquisa-tabela-fipe.component';
import { ElaboraPropostaComponent } from './elabora-proposta/elabora-proposta.component';
import { EnviaPropostaComponent } from './envia-proposta/envia-proposta.component';
import { LerTabelaFipeComponent } from './ler-tabela-fipe/ler-tabela-fipe.component';
import { PropostasEnviadasComponent } from './propostas-enviadas/propostas-enviadas.component';
import { PesquisaClienteModule } from '../pesquisa-cliente/pesquisa-cliente.module';
import { PlacaPipe } from '../shared/pipes/placa/placa.pipe';
import { FormataDinheiroPipe } from '../shared/pipes/mascaraDinheiro/formata-dinheiro.pipe';


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    MDBBootstrapModulesPro,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    PesquisaClienteModule,

  ],
  declarations: [
    PropostaComponent,
    PesquisaPlacaComponent,
    PesquisaTabelaFipeComponent,
    ElaboraPropostaComponent,
    EnviaPropostaComponent,
    LerTabelaFipeComponent,
    PropostasEnviadasComponent
  ],
  providers: [
    Proposta,
    ComunicaPropostaService,
    PlacaPipe,
    FormataDinheiroPipe,
  ],
  exports: [
    PropostaComponent
  ]

})
export class PropostaModule { }
