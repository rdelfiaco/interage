import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModulesPro, ToastModule } from '../../lib/ng-uikit-pro-standard';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PesquisaPessoaComponent } from './pesquisa-pessoa.component';
import { CadastroPessoaModule } from '../cadastro-pessoa/cadastro-pessoa.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule,
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot(),
    FormsModule,
    CadastroPessoaModule
  ],
  declarations: [PesquisaPessoaComponent],
  exports: [PesquisaPessoaComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class PesquisaPessoaModule { }
