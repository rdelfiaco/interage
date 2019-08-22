import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotivosCanaisComponent } from './motivos-canais/motivos-canais.component';
import { MotivosDosEventosComponent } from './motivos-dos-eventos.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModulesPro } from '../../lib/ng-uikit-pro-standard';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CarregandoModule } from '../shared/carregando/carregando.module';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { MotivosRespostasComponent } from './motivos-respostas/motivos-respostas.component';
import { MotivosEventosAutomaticosComponent } from './motivos-eventos-automaticos/motivos-eventos-automaticos.component';


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    MDBBootstrapModulesPro,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CarregandoModule,
    AngularDualListBoxModule,
  ],
  declarations: [MotivosCanaisComponent,
                MotivosDosEventosComponent,
                MotivosRespostasComponent,
                MotivosEventosAutomaticosComponent
                ]
})
export class MotivosDosEventosModule { }
