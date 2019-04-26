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
  // TROCA DADOS SERVIDOR TROCAR NUMERO DA VERSÃO
  versaoSistema: string = 'V.1.0.39';
  counterEvents: number;
  sub: any;
  constructor(private router: Router, private auth: AuthService, private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage) {
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
  }


  openPage(page: string) {
    this.router.navigate([page]);
  }

  abrirCadastroPessoa() {
    window.open(`/pessoas/${this.usuarioLogado.id_pessoa }`, '_blank')
  }

}