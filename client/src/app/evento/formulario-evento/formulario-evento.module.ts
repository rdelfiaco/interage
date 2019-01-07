import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioEventoComponent } from './formulario-evento.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModulesPro } from '../../../lib/ng-uikit-pro-standard';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    MDBBootstrapModulesPro,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    
    
  ],
  declarations: [
    FormularioEventoComponent
  ],
  exports: [
    FormularioEventoComponent
  ]
})
export class FormularioEventoModule { }
