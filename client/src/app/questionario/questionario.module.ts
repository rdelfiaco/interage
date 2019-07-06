import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularDualListBoxModule } from 'angular-dual-listbox';

import { QuestionarioComponent } from './questionario.component';
import { QuestionarioEditComponent } from './questionario-edit/questionario-edit.component';
import { PerguntaEditComponent } from './components/pergunta/pergunta-edit/pergunta-edit.component';
import { AlternativaEditComponent } from './components/alternativa/alternativa-edit/alternativa-edit.component';

 // MDB Angular Pro
import { MDBBootstrapModulesPro, WavesModule, IconsModule, ButtonsModule, CheckboxModule, CardsFreeModule, InputsModule } from 'ng-uikit-pro-standard';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    WavesModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
    ButtonsModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    IconsModule,
    CheckboxModule,
    CardsFreeModule,
    AngularDualListBoxModule,
    InputsModule.forRoot(),
  ],
  declarations: [
    QuestionarioComponent,
    QuestionarioEditComponent,
    PerguntaEditComponent,
    AlternativaEditComponent
  ]
})
export class QuestionarioModule { }
