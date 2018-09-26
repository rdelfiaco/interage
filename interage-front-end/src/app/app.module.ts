


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModulesPro, MDBSpinningPreloader } from './../lib/ng-uikit-pro-standard';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardOperadorComponent } from './dashboard-operador/dashboard-operador.component';
import { DashboardSupervisorComponent } from './dashboard-supervisor/dashboard-supervisor.component';
import { LoginModule } from './login/login.module';
import { SemPermissaoComponent } from './sem-permissao/sem-permissao.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TelemarketingComponent } from './telemarketing/telemarketing.component';
import { TelemarketingQuestionarioComponent } from './telemarketing-questionario/telemarketing-questionario.component';
import { CadastroPessoaComponent } from './cadastro-pessoa/cadastro-pessoa.component';




@NgModule({
  declarations: [
    AppComponent,
    DashboardAdminComponent,
    DashboardOperadorComponent,
    DashboardSupervisorComponent,
    SemPermissaoComponent,
    PageNotFoundComponent,
    TelemarketingComponent,
    TelemarketingQuestionarioComponent,
    CadastroPessoaComponent,
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModulesPro.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule,
    LoginModule,

  ],
  providers: [MDBSpinningPreloader],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
