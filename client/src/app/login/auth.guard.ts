import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LocalStorage } from '../shared/services/localStorage';
import { Usuario } from './usuario';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private auth: AuthService,
    private localStorage: LocalStorage) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.auth.checkAutenticacao()) {
      let usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
      if (this._checkPermissaoRota(route, usuarioLogado))
        return true;
      else {
        this.router.navigate(['/semPermissao']);
      }
    }
    else {
      this.auth.logout();
      this.router.navigate(['/']);
    }
  }

  _checkPermissaoRota(route: ActivatedRouteSnapshot, usuarioLogado: Usuario) {
    const rotas = {
      admin: ['admin'],
      supervisor: ['admin', 'supervisor'],
      operador: ['admin', 'operador', 'supervisor'],
      vendasInternas: ['admin', 'supervisor', 'operador'],
      eventos: ['admin', 'supervisor', 'operador', 'vistoria'],
      pessoas: ['admin', 'supervisor', 'operador'],
      pessoasAdd: ['admin', 'supervisor', 'operador'],
      analisaCampanha: ['admin', 'supervisor'],
      AnalisarCampanhaTelemarketingComponent: ['admin', 'supervisor'],
      produtividadeCallCenter: ['admin', 'supervisor', 'operador'],
      trocarSenha: ['admin', 'supervisor', 'operador', 'vistoria'],
      propostas: ['admin', 'supervisor', 'operador'],
      "proposta/:id": ['admin', 'supervisor', 'operador', 'vistoria'],
      importaLead: ['admin', 'supervisor'],
      "evento/:id": ['admin', 'supervisor', 'operador', 'vistoria'],
      "pessoas/:id": ['admin', 'supervisor', 'operador'],
      exportar: ['admin', 'supervisor'],
      dashboard: ['admin', 'supervisor'],
      dashboardProposta: ['admin', 'supervisor'],
      dashboardAgente: ['admin', 'supervisor', 'operador'],
      workflow: ['admin', 'supervisor'],
      "tarefa/:id": ['admin', 'supervisor'],
      analisarCampanhaTelemarketing: ['admin', 'supervisor'],
      "showTable/:parametros":['admin', 'supervisor', 'operador'],
      ranks:['admin', 'supervisor'],
      "detalheDeCampanha/:parametros": ['admin', 'supervisor'],
      usuario: ['admin', 'supervisor'],
      departamento: ['admin', 'supervisor'],

    }
    if (rotas[route.routeConfig.path].indexOf(usuarioLogado.dashboard) != -1) return true;
  }
}