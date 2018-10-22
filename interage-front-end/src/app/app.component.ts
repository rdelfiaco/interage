import { Component } from '@angular/core';
import { AuthService } from './login/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  usuarioLogado: Observable<boolean>;
  // TROCA DADOS SERVIDOR TROCAR NUMERO DA VERSÃO
  versaoSistema: string = 't.1.0.6';
  constructor(private router: Router, private auth: AuthService) {
    this.usuarioLogado = this.auth.estaLogado();
  }

  logout() {
    this.auth.logout();
  }

  openPage(page: string) {
    this.router.navigate([page]);
  }
}