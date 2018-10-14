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
      telemarketing: ['admin', 'supervisor', 'operador'],
      eventos: ['admin', 'supervisor', 'operador'],
      pessoas: ['admin', 'supervisor', 'operador'],
      pessoasAdd: ['admin', 'supervisor', 'operador'],
      analisaCampanha: ['admin', 'supervisor'],
      produtividadeCallCenter: ['admin', 'supervisor', 'operador'],
    }
    if (rotas[route.routeConfig.path].indexOf(usuarioLogado.dashboard) != -1) return true;
  }
}