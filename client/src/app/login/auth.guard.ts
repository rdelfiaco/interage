import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LocalStorage } from '../shared/services/localStorage';
import { Usuario } from './usuario';
import { elementStyle } from '@angular/core/src/render3/instructions';

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
        if (route.routeConfig.path == '/login') {
          this.router.navigate(['/login']);
        }else {
        this.router.navigate(['/semPermissao']);
        }
      }
    }
    else {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  }

  _checkPermissaoRota(route: ActivatedRouteSnapshot, usuarioLogado: Usuario) {
      let rotas = [];
      (usuarioLogado.permissoes || []).forEach(elem =>{
          if (elem.rota != null) rotas.push(elem.rota)
      });
      if (rotas.find( element => element == route.routeConfig.path) ) 
        { return true;
        } else {
          return false;
        }
  }
}