import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncaminharEventoComponent } from './encaminhar-evento.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModulesPro } from '../../../lib/ng-uikit-pro-standard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CriarEventoModule } from '../criar-evento/criar-evento.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    MDBBootstrapModulesPro,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CriarEventoModule
  ],
  declarations: [EncaminharEventoComponent],
  exports: [EncaminharEventoComponent],
})
export class EncaminharEventoModule { }
