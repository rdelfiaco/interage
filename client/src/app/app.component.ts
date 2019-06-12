import { CheckPermissaoRecurso } from './shared/services/checkPemissaoRecurso';
import { Component } from '@angular/core';
import { AuthService } from './login/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConnectHTTP } from './shared/services/connectHTTP';
import { Usuario } from './login/usuario';
import { LocalStorage } from './shared/services/localStorage';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  hasLogado: Observable<boolean>;
  usuarioLogado: Usuario;
  nomeUsuario: string = 'Usuário';
  // TROCA DADOS SERVIDOR TROCAR NUMERO DA VERSÃO
  versaoSistema: string = 'V.2.0.0';
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

  logout() {
    this.usuarioLogado = null;
    this.auth.logout();
    window.location.reload();
  }


  openPage(page: string) {
    this.router.navigate([page]);
  }

  abrirCadastroPessoa() {
    window.open(`/pessoas/${this.usuarioLogado.id_pessoa }`, '_blank')
  }

  temPermissao(recurso) {

    return this.checkPermissaoRecurso.usuarioLocadoAcessaRecurso(recurso)

  }

}