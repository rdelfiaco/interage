
import { DashboardSupervisorComponent } from './dashboard-supervisor/dashboard-supervisor.component';
import { DashboardOperadorComponent } from './dashboard-operador/dashboard-operador.component';

import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: DashboardAdminComponent },
  { path: 'operador', component: DashboardOperadorComponent },
  { path: 'supervisor', component: DashboardSupervisorComponent },
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