import { UsuarioComponent } from './usuario.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModulesPro } from '../../lib/ng-uikit-pro-standard';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CarregandoModule } from '../shared/carregando/carregando.module';
import { SharedModule } from '../shared/shared.module';
import { PesquisaClienteModule } from '../pesquisa-cliente/pesquisa-cliente.module';
import { TrocarSenhaComponent } from './trocar-senha/trocar-senha.component';
import { UsuarioCampanhasComponent } from './usuario-campanhas/usuario-campanhas.component';
import { ListarUsuariosComponent } from './listar-usuarios/listar-usuarios.component';
import { UsuarioPermissoesComponent } from './usuario-permissoes/usuario-permissoes.component';
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
    UsuarioComponent,
    TrocarSenhaComponent,
    UsuarioCampanhasComponent,
    ListarUsuariosComponent,
    UsuarioPermissoesComponent,
  ]
})
export class UsuarioModule { }
