
import { DashboardSupervisorComponent } from './dashboard-supervisor/dashboard-supervisor.component';
import { DashboardOperadorComponent } from './dashboard-operador/dashboard-operador.component';

import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './login/auth.guard';


const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  // {
  //   path: 'semPermissao', component: LoginComponent
  // },
  {
    path: 'admin',
    permission: 'admin',
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