import { MotivosDosEventosModule } from './motivos-dos-eventos/motivos-dos-eventos.module';
import { PausaModule } from './pausa/pausa.module';
import { CrudCampanhaModule } from './crud-campanha/crud-campanha.module';
import { QuestionarioModule } from './questionario/questionario.module';
import { DepartamentoModule } from './departamento/departamento.module';
import { UsuarioModule } from './usuario/usuario.module';
import { WorkflowModule } from './workflow/workflow.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  MDBBootstrapModulesPro,
  MDBSpinningPreloader,
  ToastModule,
  AccordionModule,
  WavesModule,
  SidenavModule,
  NavbarModule,
  InputsModule,
  CardsFreeModule,
  IconsModule,
 } from './../lib/ng-uikit-pro-standard';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './login/login.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventoModule } from './evento/evento.module';
import { AnalisaCampanhaComponent } from './analisa-campanha/analisa-campanha.component';
import { ProdutividadeCallCenterComponent } from './produtividade-call-center/produtividade-call-center.component';
import { ImportaLeadComponent } from './importa-lead/importa-lead.component';
import { CarregandoModule } from './shared/carregando/carregando.module';
import { SemPermissaoModule } from './sem-permissao/sem-permissao.module';
import { TelemarketingModule } from './telemarketing/telemarketing.module';
import { PipesModule } from './shared/pipes/pipesModule';
import { PesquisaPessoaModule } from './pesquisa-pessoa/pesquisa-pessoa.module';
import { ExportarComponent } from './exportar/exportar.component';
import { ShowTableComponent } from './show-table/show-table.component';
import { RanksComponent } from './ranks/ranks.component';
import { AnalisarCampanhaTelemarketingModule } from './analisar-campanha-telemarketing/analisar-campanha-telemarketing.module';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
import { AppsLayoutComponent } from './layout/apps-layout/apps-layout.component';
import { PagesLayoutComponent } from './layout/pages-layout/pages-layout.component';
import { TipoDeClienteComponent } from './tipo-de-cliente/tipo-de-cliente.component';
import { ObjecaoComponent } from './objecao/objecao.component';
import { ClassifcacaoDeClientesComponent } from './classifcacao-de-clientes/classifcacao-de-clientes.component';
import { CanaisComponent } from './canais/canais.component';
import { SharedModule } from './shared/shared.module';
import { TipoDeRelacionamentoModule } from './tipo-de-relacionamento/tipo-de-relacionamento.module';
import { AtendimentoComponent } from './atendimento/atendimento.component';
import { AtendimentoInformacaoComponent } from './atendimento-informacao/atendimento-informacao.component';
import { ParametrosInterageComponent } from './parametros-interage/parametros-interage.component';
import { StandardUploadsComponent } from './standard-uploads/standard-uploads.component';
import { FilesUploadsComponent } from './files-uploads/files-uploads.component';
import { EmailTemplateCreateComponent } from './email-template/email-template-create/email-template-create.component';
import { EmailTemplateDeleteComponent } from './email-template/email-template-delete/email-template-delete.component';
import { EmailTemplateUpdateComponent } from './email-template/email-template-update/email-template-update.component';
import { EmailTemplateReadComponent } from './email-template/email-template-read/email-template-read.component';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    AnalisaCampanhaComponent,
    ProdutividadeCallCenterComponent,
    ImportaLeadComponent,
    ExportarComponent,
    ShowTableComponent,
    RanksComponent,
    BaseLayoutComponent,
    AppsLayoutComponent,
    PagesLayoutComponent,
    TipoDeClienteComponent,
    ObjecaoComponent,
    ClassifcacaoDeClientesComponent,
    CanaisComponent,
    AtendimentoComponent,
    AtendimentoInformacaoComponent,
    ParametrosInterageComponent,
    StandardUploadsComponent,
    FilesUploadsComponent,
    EmailTemplateCreateComponent,
    EmailTemplateDeleteComponent,
    EmailTemplateUpdateComponent,
    EmailTemplateReadComponent,
    
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot(),
    CardsFreeModule,
    IconsModule,
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
    SidenavModule,
    InputsModule,
    AnalisarCampanhaTelemarketingModule,
    UsuarioModule,
    DepartamentoModule,
    AngularDualListBoxModule,
    CrudCampanhaModule,
    QuestionarioModule,
    SharedModule,
    PausaModule,
    MotivosDosEventosModule,
    TipoDeRelacionamentoModule,
    HttpClientModule, 
    AngularEditorModule

  ],
  providers: [MDBSpinningPreloader
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
