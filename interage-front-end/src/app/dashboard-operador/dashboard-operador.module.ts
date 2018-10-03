import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoModule } from '../evento/evento.module';
import { EventoComponent } from '../evento/evento.component';

@NgModule({
  imports: [
    CommonModule,
    EventoModule
  ],
  declarations: [
    EventoComponent
  ]
})
export class DashboardOperadorModule { }
