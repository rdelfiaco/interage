import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usuario: Usuario = new Usuario();

  loginForm: FormGroup;


  constructor(
    formBuilder: FormBuilder
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
    )};

  ngOnInit() {

  };

  fazerLogin(){
    
    this.usuario.login = this.loginForm.value.login;
    this.usuario.senha = this.loginForm.value.senha;

    console.log(this.usuario)


  }

  
}
