import { ShowTableComponent } from './show-table/show-table.component';
import { AnalisarCampanhaTelemarketingComponent } from './analisar-campanha-telemarketing/analisar-campanha-telemarketing.component';
import { TarefaComponent } from './workflow/tarefa/tarefa.component';
import { DashboardAgenteComponent } from './dashboard-agente/dashboard-agente.component';
import { DashboardPropostaComponent } from './dashboard-proposta/dashboard-proposta.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExportarComponent } from './exportar/exportar.component';
import { DetalhePropostaComponent } from './proposta/detalhe-proposta/detalhe-proposta.component';
import { ImportaLeadComponent } from './importa-lead/importa-lead.component';
import { PropostaComponent } from './proposta/proposta.component';
import { EventoComponent } from './evento/evento.component';

import { DashboardSupervisorComponent } from './dashboard-supervisor/dashboard-supervisor.component';
import { DashboardOperadorComponent } from './dashboard-operador/dashboard-operador.component';

import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './login/auth.guard';
import { SemPermissaoComponent } from './sem-permissao/sem-permissao.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TelemarketingComponent } from './telemarketing/telemarketing.component';
import { PesquisaPessoaComponent } from './pesquisa-pessoa/pesquisa-pessoa.component';
import { CadastroPessoaComponent } from './cadastro-pessoa/cadastro-pessoa.component';
import { AnalisaCampanhaComponent } from './analisa-campanha/analisa-campanha.component';
import { ProdutividadeCallCenterComponent } from './produtividade-call-center/produtividade-call-center.component';
import { TrocarSenhaComponent } from './usuario/trocar-senha/trocar-senha.component';
import { DetalheEventoComponent } from './evento/detalhe-evento/detalhe-evento.component';



const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'semPermissao', component: SemPermissaoComponent
  },
  {
    path: 'admin',
    component: EventoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'operador',
    component: EventoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'supervisor',
    component: EventoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vendasInternas',
    component: TelemarketingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'eventos',
    component: EventoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'evento/:id',
    component: DetalheEventoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pessoas',
    component: PesquisaPessoaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pessoas/:id',
    component: CadastroPessoaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pessoasAdd',
    component: CadastroPessoaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'analisaCampanha',
    component: AnalisaCampanhaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'analisarCampanhaTelemarketing',
    component: AnalisarCampanhaTelemarketingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'produtividadeCallCenter',
    component: ProdutividadeCallCenterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'trocarSenha',
    component: TrocarSenhaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'propostas',
    component: PropostaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'proposta/:id',
    component: DetalhePropostaComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'importaLead',
    component: ImportaLeadComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'exportar',
    component: ExportarComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboardProposta',
    component: DashboardPropostaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboardAgente',
    component: DashboardAgenteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'workflow',
    component: WorkflowComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tarefa/:id',
    component: TarefaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'showTable/:sql',
    component: ShowTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),

  ],

  exports: [RouterModule],

  declarations: []
})
export class AppRoutingModule { }