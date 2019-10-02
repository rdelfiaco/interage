import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModulesPro } from '../../lib/ng-uikit-pro-standard';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CarregandoModule } from '../shared/carregando/carregando.module';
import { SharedModule } from '../shared/shared.module';
import { AngularDualListBoxModule } from 'angular-dual-listbox';


import { UsuariosCampanhaComponent } from './usuarios-campanha/usuarios-campanha.component';
import { CrudCampanhaComponent } from './crud-campanha.component';


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
    AngularDualListBoxModule,
  ],
  declarations: [ 
                  UsuariosCampanhaComponent,  
                  CrudCampanhaComponent,            
  ]
})
export class CrudCampanhaModule { }
