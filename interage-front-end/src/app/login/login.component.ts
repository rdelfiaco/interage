import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from '../shared/services/localStorage';


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
    private router: Router
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
    if (new AuthService().checkAutenticacao()) {
      let usuarioLogado = new LocalStorage().getLocalStorage('usuarioLogado') as Usuario;
      this.router.navigate([usuarioLogado.dashboard]);
    }
  }

  async fazerLogin() {
    this.usuario.login = this.loginForm.value.login;
    this.usuario.senha = this.loginForm.value.senha;

    const res = await new AuthService().autenticacao(this.usuario)
    if (res.error) {
      console.log(res.error)
    }
    else {
      let usuarioLogado = res.resposta
      this.router.navigate([usuarioLogado.dashboard]);
    }
  }


}
