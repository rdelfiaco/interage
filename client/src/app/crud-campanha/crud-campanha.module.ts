import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModulesPro } from '../../lib/ng-uikit-pro-standard';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CarregandoModule } from '../shared/carregando/carregando.module';
import { SharedModule } from '../shared/shared.module';
import { AngularDualListBoxModule } from 'angular-dual-listbox';

import { UpdateCampanhaComponent } from './update-campanha/update-campanha.component';
import { ReadCampanhaComponent } from './read-campanha/read-campanha.component';
import { DeleteCampanhaComponent } from './delete-campanha/delete-campanha.component';
import { CreateCampanhaComponent } from './create-campanha/create-campanha.component';
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
  declarations: [ CreateCampanhaComponent, 
                  DeleteCampanhaComponent,
                  ReadCampanhaComponent,
                  UpdateCampanhaComponent,
                  UsuariosCampanhaComponent,  
                  CrudCampanhaComponent,            
  ]
})
export class CrudCampanhaModule { }
