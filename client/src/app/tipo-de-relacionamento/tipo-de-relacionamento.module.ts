import { TipoDeRelacionamentoComponent } from './tipo-de-relacionamento.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelacionamentoVoltaComponent } from './relacionamento-volta/relacionamento-volta.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModulesPro } from '../../lib/ng-uikit-pro-standard';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PesquisaClienteModule } from '../pesquisa-cliente/pesquisa-cliente.module';
import { CarregandoModule } from '../shared/carregando/carregando.module';
import { AngularDualListBoxModule } from 'angular-dual-listbox';

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
    CarregandoModule,
    AngularDualListBoxModule,
  ],
  declarations: [
    TipoDeRelacionamentoComponent,
    RelacionamentoVoltaComponent]
})
export class TipoDeRelacionamentoModule { }
