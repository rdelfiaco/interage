import { Router } from '@angular/router';
import { Injectable, EventEmitter } from '@angular/core';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioAutenticado: boolean = false;

  eventEmitter = new EventEmitter<boolean>();

  constructor( private router: Router ) { }

  fazerLogin(usuario: Usuario){

    if (usuario.login === 'usuario' && 
        usuario.senha === '123') {
        
        usuario.dashboard = 'dashboard';

        this.usuarioAutenticado = true;  

        this.eventEmitter.emit(true);

        console.log(usuario.dashboard);
        
        this.router.navigate([usuario.dashboard ]);


        } else {

          this.usuarioAutenticado = false;
          
          this.eventEmitter.emit(false);

          this.router.navigate(['login']);

        }
    
  }

  usuarioEstaAutenticado(){
    return this.usuarioAutenticado;
  }
}
