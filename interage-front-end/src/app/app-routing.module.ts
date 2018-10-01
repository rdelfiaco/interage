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
    component: DashboardAdminComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'operador',
    component: DashboardOperadorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'supervisor',
    component: DashboardSupervisorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'telemarketing',
    component: TelemarketingComponent,
    canActivate: [AuthGuard]
  },
 {
    path: 'eventos',
    component: EventoComponent,
    canActivate: [AuthGuard]
  },



  { path: '**', component: PageNotFoundComponent }
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