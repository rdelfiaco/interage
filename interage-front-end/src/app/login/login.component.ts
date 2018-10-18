import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from '../shared/services/localStorage';
import { ToastService } from '../../lib/ng-uikit-pro-standard';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  usuario: Usuario = new Usuario();
  loginForm: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private localStorage: LocalStorage,
    private toastrService: ToastService
  ) {

    this.loginForm = formBuilder.group({
      login: ['', [
        Validators.required
      ]
      ],
      senha: ['', [
        Validators.required
      ]
      ],

    }
    )
  };

  ngOnInit() {
    if (this.auth.checkAutenticacao()) {
      let usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
      this.router.navigate([usuarioLogado.dashboard]);
    }
    else this.auth.logout();
  }

  async fazerLogin() {
    this.usuario.login = this.loginForm.value.login;
    this.usuario.senha = this.loginForm.value.senha;

    const res = await this.auth.autenticacao(this.usuario)
    if (res.error) {
      this.toastrService.error(res.error);
    }
    else {
      let usuarioLogado = res.resposta
      this.router.navigate([usuarioLogado.dashboard]);
    }
  }


}
