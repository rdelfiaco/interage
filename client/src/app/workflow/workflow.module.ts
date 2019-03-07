import { WorkflowComponent } from './workflow.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarefaComponent } from './tarefa/tarefa.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModulesPro } from '../../lib/ng-uikit-pro-standard';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PesquisaClienteModule } from '../pesquisa-cliente/pesquisa-cliente.module';
import { CarregandoModule } from '../shared/carregando/carregando.module';

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
  ],
  declarations: [
    WorkflowComponent,
    TarefaComponent
  ]
})
export class WorkflowModule { }
