import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionarioComponent } from './questionario.component';
import { QuestionarioAddComponent } from './questionario-add/questionario-add.component';
import { QuestionarioEditComponent } from './questionario-edit/questionario-edit.component';
import { PerguntaComponent } from './components/pergunta/pergunta.component';
import { PerguntaAddComponent } from './components/pergunta/pergunta-add/pergunta-add.component';
import { PerguntaEditComponent } from './components/pergunta/pergunta-edit/pergunta-edit.component';
import { RespostaComponent } from './components/resposta/resposta.component';
import { RespostaAddComponent } from './components/resposta/resposta-add/resposta-add.component';
import { RespostaEditComponent } from './components/resposta/resposta-edit/resposta-edit.component';

@NgModule({
  imports: [
    CommonModule
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
