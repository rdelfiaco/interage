import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularDualListBoxModule } from 'angular-dual-listbox';

import { QuestionarioComponent } from './questionario.component';
import { QuestionarioAddComponent } from './questionario-add/questionario-add.component';
import { QuestionarioEditComponent } from './questionario-edit/questionario-edit.component';
import { PerguntaComponent } from './components/pergunta/pergunta.component';
import { PerguntaAddComponent } from './components/pergunta/pergunta-add/pergunta-add.component';
import { PerguntaEditComponent } from './components/pergunta/pergunta-edit/pergunta-edit.component';
import { RespostaComponent } from './components/resposta/resposta.component';
import { RespostaAddComponent } from './components/resposta/resposta-add/resposta-add.component';
import { RespostaEditComponent } from './components/resposta/resposta-edit/resposta-edit.component';

 // MDB Angular Pro
import { MDBBootstrapModulesPro, WavesModule, IconsModule, ButtonsModule, CheckboxModule, CardsFreeModule } from 'ng-uikit-pro-standard';

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
    AngularDualListBoxModule
  ],
  declarations: [
    QuestionarioComponent,
    QuestionarioAddComponent,
    QuestionarioEditComponent,
    PerguntaComponent,
    PerguntaAddComponent,
    PerguntaEditComponent,
    RespostaComponent,
    RespostaAddComponent,
    RespostaEditComponent
  ]
})
export class QuestionarioModule { }
