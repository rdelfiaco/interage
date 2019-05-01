import { AnalisarCampanhaTelemarketingComponent } from './analisar-campanha-telemarketing.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModulesPro, ToastModule } from '../../lib/ng-uikit-pro-standard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot(),

  ],
  declarations: [
    AnalisarCampanhaTelemarketingComponent
  ],
  exports:[
    
  ]

})
export class AnalisarCampanhaTelemarketingModule { }
