import { async } from '@angular/core/testing';
import { Component, NgModule,  OnInit } from '@angular/core';
import { CheckPermissaoRecurso } from '../../shared/services/checkPemissaoRecurso';
import { AuthService } from '../../login/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { Usuario } from '../../login/usuario';
import { LocalStorage } from '../../shared/services/localStorage';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss']
})
export class BaseLayoutComponent {
  hasLogado: Observable<boolean>;
  usuarioLogado: Usuario;
  nomeUsuario: string = 'Usuário';
  // TROCA DADOS SERVIDOR TROCAR NUMERO DA VERSÃO
  versaoSistema: string = 'V.2.1.8';
  versaoTeste: boolean = true; 
  counterEvents: number;
  sub: any;
  constructor(private router: Router, 
    private auth: AuthService, 
    private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private checkPermissaoRecurso: CheckPermissaoRecurso) {
    this.hasLogado = this.auth.estaLogado();
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.getCounterEvents();
    
  }

  async getCounterEvents() {
    let self = this;
    let res = await this.auth.getCounterEvents();
    if (!this.sub)
      this.sub = res.subscribe(o => {
        self.counterEvents = o;
      });
  }

  async logout() {
     let usuarioLogado = this.auth.getUsuarioLogadoLocalStorage();
    if (!usuarioLogado) return;
    await this.connectHTTP.callService({
      service: 'logout',
      naoExigeToken: true,
      paramsService: {
        token: usuarioLogado.token,
        id_usuario: usuarioLogado.id
      }
    })
    //this.counterEvents.next(0);
    this.localStorage.delLocalStorage('usuarioLogado', 'object')
    this.router.navigate(['/login']);
  }


  openPage(page: string, event: any) {
    event.preventDefault();
    event.stopPropagation();
    setTimeout(_ => {
      this.router.navigate([page]);
    }, 100);
  }

  abrirCadastroPessoa() {
    window.open(`/pessoas/${this.usuarioLogado.id_pessoa }`, '_blank')
  }

  temPermissao(recurso) {
    return this.checkPermissaoRecurso.usuarioLocadoAcessaRecurso(recurso)

  }
}
