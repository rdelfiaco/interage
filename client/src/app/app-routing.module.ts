import { TipoDeRelacionamentoComponent } from './tipo-de-relacionamento/tipo-de-relacionamento.component';
import { UsuarioCarteiraComponent } from './usuario/usuario-carteira/usuario-carteira.component';
import { MotivosRespostasComponent } from './motivos-dos-eventos/motivos-respostas/motivos-respostas.component';
import { MotivosCanaisComponent } from './motivos-dos-eventos/motivos-canais/motivos-canais.component';
import { CanaisComponent } from './canais/canais.component';
import { MotivosDosEventosComponent } from './motivos-dos-eventos/motivos-dos-eventos.component';
import { ClassifcacaoDeClientesComponent } from './classifcacao-de-clientes/classifcacao-de-clientes.component';
import { ObjecaoComponent } from './objecao/objecao.component';
import { TipoDeClienteComponent } from './tipo-de-cliente/tipo-de-cliente.component';
import { AuditoriaComponent } from './cadastro-pessoa/auditoria/auditoria.component';
import { MarketingComponent } from './cadastro-pessoa/marketing/marketing.component';

import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
import { PagesLayoutComponent } from './layout/pages-layout/pages-layout.component';
import { UsuariosCampanhaComponent } from './crud-campanha/usuarios-campanha/usuarios-campanha.component';
import { CrudCampanhaComponent } from './crud-campanha/crud-campanha.component';
import { UsuarioCampanhasComponent } from './usuario/usuario-campanhas/usuario-campanhas.component';
import { DepartamentoComponent } from './departamento/departamento.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { DetalheDeCampanhaComponent } from './analisar-campanha-telemarketing/detalhe-de-campanha/detalhe-de-campanha.component';
import { RanksComponent } from './ranks/ranks.component';
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
import { NgModule, Component } from '@angular/core';
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
import { ListarUsuariosComponent } from './usuario/listar-usuarios/listar-usuarios.component';
import { UsuarioPermissoesComponent } from './usuario/usuario-permissoes/usuario-permissoes.component';
import { QuestionarioComponent } from './questionario/questionario.component';
import { QuestionarioEditComponent } from './questionario/questionario-edit/questionario-edit.component';
import { PerguntaEditComponent } from './questionario/components/pergunta/pergunta-edit/pergunta-edit.component';
import { AlternativaEditComponent } from './questionario/components/alternativa/alternativa-edit/alternativa-edit.component';
import { NetworkingComponent } from './cadastro-pessoa/networking/networking.component';
import { PausaComponent } from './pausa/pausa.component';
import { PausaDoUsuarioComponent } from './pausa/pausa-do-usuario/pausa-do-usuario.component';
import { MotivosEventosAutomaticosComponent } from './motivos-dos-eventos/motivos-eventos-automaticos/motivos-eventos-automaticos.component';
import { RelacionamentoVoltaComponent } from './tipo-de-relacionamento/relacionamento-volta/relacionamento-volta.component';



const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
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
        path: 'showTable/:parametros',
        component: ShowTableComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'ranks',
        component: RanksComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'detalheDeCampanha/:parametros',
        component: DetalheDeCampanhaComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'usuario',
        component: UsuarioComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'questionario',
        component: QuestionarioComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'questionario/:id',
        component: QuestionarioEditComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: 'questionario/:id/pergunta/:id',
        component: PerguntaEditComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: 'questionario/:id/pergunta/:id/alternativa/:id',
        component: AlternativaEditComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: 'listarUsuarios',
        component: ListarUsuariosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'usuarioCampanhas/:id',
        component: UsuarioCampanhasComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'usuarioPermissoes/:id',
        component: UsuarioPermissoesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'usuarioCarteira',
        component: UsuarioCarteiraComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'departamento',
        component: DepartamentoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'campanha',
        component: CrudCampanhaComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'usuariosCampanha',
        component: UsuariosCampanhaComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'pesssoasNetworking',
        component: NetworkingComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'pausa',
        component: PausaComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'pausaDoUsuario/:id',
        component: PausaDoUsuarioComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'pessoaMarketing',
        component: MarketingComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'pessoaAuditoria',
        component: AuditoriaComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tipoDecliente',
        component: TipoDeClienteComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'classificacaoClietes',
        component: ClassifcacaoDeClientesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'objecao',
        component: ObjecaoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'motivosDosEventos',
        component: MotivosDosEventosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'canais',
        component: CanaisComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'motivosCanais/:id',
        component: MotivosCanaisComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'motivosRespostas/:id',
        component: MotivosRespostasComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'motivosEventosAutomaticos/:id',
        component: MotivosEventosAutomaticosComponent ,
        canActivate: [AuthGuard]
      },
      {
        path: 'tipoDeRelacionamento',
        component: TipoDeRelacionamentoComponent,
        canActivate: [AuthGuard]
      }, 
      {
        path: 'relacionamentoVolta/:id',
        component: RelacionamentoVoltaComponent ,
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: '',
    component: PagesLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
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