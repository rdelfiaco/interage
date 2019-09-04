import { DetalheDeCampanhaComponent } from './detalhe-de-campanha/detalhe-de-campanha.component';
import { AnalisarCampanhaTelemarketingComponent } from './analisar-campanha-telemarketing.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModulesPro, ToastModule } from '../../lib/ng-uikit-pro-standard';
import { TreeviewModule } from 'ngx-treeview';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot(),
    TreeviewModule.forRoot(),

  ],
  declarations: [
    AnalisarCampanhaTelemarketingComponent,
    DetalheDeCampanhaComponent
  ],
  exports:[
    
  ]

})
export class AnalisarCampanhaTelemarketingModule { }
