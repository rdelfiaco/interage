import { WorkflowModule } from './workflow/workflow.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModulesPro, MDBSpinningPreloader, ToastModule, AccordionModule, WavesModule, SidenavModule, NavbarModule } from './../lib/ng-uikit-pro-standard';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardOperadorComponent } from './dashboard-operador/dashboard-operador.component';
import { DashboardSupervisorComponent } from './dashboard-supervisor/dashboard-supervisor.component';

import { LoginModule } from './login/login.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventoModule } from './evento/evento.module';
import { AnalisaCampanhaComponent } from './analisa-campanha/analisa-campanha.component';
import { ProdutividadeCallCenterComponent } from './produtividade-call-center/produtividade-call-center.component';
import { TrocarSenhaComponent } from './usuario/trocar-senha/trocar-senha.component';
import { ImportaLeadComponent } from './importa-lead/importa-lead.component';

import { CarregandoModule } from './shared/carregando/carregando.module';
import { SemPermissaoModule } from './sem-permissao/sem-permissao.module';
import { TelemarketingModule } from './telemarketing/telemarketing.module';
import { PipesModule } from './shared/pipes/pipesModule';
import { PesquisaPessoaModule } from './pesquisa-pessoa/pesquisa-pessoa.module';
import { ExportarComponent } from './exportar/exportar.component';
import { DashboardPropostaComponent } from './dashboard-proposta/dashboard-proposta.component';
import { DashboardAgenteComponent } from './dashboard-agente/dashboard-agente.component';
import { AnalisarCampanhaTelemarketingComponent } from './analisar-campanha-telemarketing/analisar-campanha-telemarketing.component';



@NgModule({
  declarations: [
    AppComponent,
    DashboardAdminComponent,
    DashboardOperadorComponent,
    DashboardSupervisorComponent,
    PageNotFoundComponent,
    AnalisaCampanhaComponent,
    ProdutividadeCallCenterComponent,
    TrocarSenhaComponent,
    ImportaLeadComponent,
    TrocarSenhaComponent,
    ExportarComponent,
    DashboardPropostaComponent,
    DashboardAgenteComponent,
    AnalisarCampanhaTelemarketingComponent,
  ],

  imports: [
    BrowserModule,
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule,
    LoginModule,
    FormsModule,
    ReactiveFormsModule,
    EventoModule,
    CarregandoModule,
    SemPermissaoModule,
    TelemarketingModule,
    PipesModule,
    PesquisaPessoaModule,
    DashboardModule,
    AccordionModule,
    WavesModule,
    WorkflowModule,
    NavbarModule,
    SidenavModule
  ],
  providers: [MDBSpinningPreloader

  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
