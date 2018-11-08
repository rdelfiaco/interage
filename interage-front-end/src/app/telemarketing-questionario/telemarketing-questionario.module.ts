import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemarketingQuestionarioComponent } from './telemarketing-questionario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModulesPro, ToastModule } from '../../lib/ng-uikit-pro-standard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { PipesModule } from '../shared/pipes/pipesModule';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot(),
    BrowserAnimationsModule,
    PipesModule
  ],
  declarations: [
    TelemarketingQuestionarioComponent,
  ],
  exports: [TelemarketingQuestionarioComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class TelemarketingQuestionarioModule { }
