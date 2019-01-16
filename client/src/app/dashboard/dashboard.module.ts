import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModulesPro, MDBSpinningPreloader } from '../../lib/ng-uikit-pro-standard';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    MDBBootstrapModulesPro.forRoot()
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [MDBSpinningPreloader],
  bootstrap: [DashboardComponent]
})
export class DashboardModule { }