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
    component: ProdutividadeCallCenterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'operador',
    component: ProdutividadeCallCenterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'supervisor',
    component: ProdutividadeCallCenterComponent,
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
    path: 'pessoas',
    component: PesquisaPessoaComponent,
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
    path: 'proposta',
    component: PropostaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'importaLead',
    component: ImportaLeadComponent,
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