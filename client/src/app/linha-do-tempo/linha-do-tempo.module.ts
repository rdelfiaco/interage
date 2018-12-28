import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModulesPro, ToastModule } from '../../lib/ng-uikit-pro-standard';
import { LinhaDoTempoComponent } from './linha-do-tempo.component';
import { ItemDeEventoComponent } from './item-de-evento/item-de-evento.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormularioEventoModule } from '../evento/formulario-evento/formulario-evento.module';
import { ConcluirEventoModule } from '../evento/concluir-evento/concluir-evento.module';
import { EncaminharEventoModule } from '../evento/encaminhar-evento/encaminhar-evento.module';

@NgModule({
  imports: [
    CommonModule,
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    FormularioEventoModule,
    ConcluirEventoModule,
    EncaminharEventoModule
  ],
  declarations: [
    LinhaDoTempoComponent,
    ItemDeEventoComponent
  ],
  exports: [
    LinhaDoTempoComponent,
    ItemDeEventoComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LinhaDoTempoModule { }
