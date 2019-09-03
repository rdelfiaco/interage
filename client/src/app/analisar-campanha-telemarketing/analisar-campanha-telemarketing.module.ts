import { DetalheDeCampanhaComponent } from './detalhe-de-campanha/detalhe-de-campanha.component';
import { AnalisarCampanhaTelemarketingComponent } from './analisar-campanha-telemarketing.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModulesPro, ToastModule } from '../../lib/ng-uikit-pro-standard';
import { DetalheRespostaQuestionarioComponent } from './detalhe-resposta-questionario/detalhe-resposta-questionario.component';
// import {MatTreeModule} from '@angular/material/tree';
import {MatButtonModule} from '@angular/material/button';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot(),
    // MatTreeModule,
    MatButtonModule
  ],
  declarations: [
    AnalisarCampanhaTelemarketingComponent,
    DetalheDeCampanhaComponent,
    DetalheRespostaQuestionarioComponent
  ],
  exports:[
    
  ]

})
export class AnalisarCampanhaTelemarketingModule { }
