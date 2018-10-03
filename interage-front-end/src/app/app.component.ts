import { Component } from '@angular/core';
import { AuthService } from './login/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private usuarioLogado: any;

  constructor(private router: Router, private auth: AuthService) {
    this.usuarioLogado = this.auth.checkAutenticacao();
  }

  logout() {
    this.auth.logout();
  }
  openPage(page: string) {
    this.router.navigate([page]);
  }
}

