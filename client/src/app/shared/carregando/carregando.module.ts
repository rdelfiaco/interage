import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarregandoComponent } from './carregando.component';
import { MDBSpinningPreloader, MDBBootstrapModulesPro } from '../../../lib/ng-uikit-pro-standard';

@NgModule({
  imports: [
    CommonModule,
    MDBBootstrapModulesPro
  ],
  declarations: [CarregandoComponent],
  exports: [CarregandoComponent],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CarregandoModule { }
