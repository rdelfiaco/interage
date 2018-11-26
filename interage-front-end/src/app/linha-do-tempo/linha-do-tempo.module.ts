import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModulesPro, ToastModule } from '../../lib/ng-uikit-pro-standard';
import { LinhaDoTempoComponent } from './linha-do-tempo.component';
import { ItemDeEventoComponent } from './item-de-evento/item-de-evento.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    LinhaDoTempoComponent,
    ItemDeEventoComponent
  ],
  exports: [
    LinhaDoTempoComponent,
    ItemDeEventoComponent
  ]
})
export class LinhaDoTempoModule { }
