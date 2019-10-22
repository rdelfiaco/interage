import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

 private usuarioSelecionado: object;
//  {
//           id: number,
//           nome: string
//  }

  emitiAba = new EventEmitter<number>();
  private abaAtual: number;
  
  emitiUsuarioSelecionado = new EventEmitter<object>();
  private UsuarioSelecionadoAtual: object; 
  
  constructor() { }

  getAba() {
    return this.abaAtual;
  };

  setAba(abaInformada: number) {
    
    this.abaAtual = abaInformada;
    this.emitiAba.emit(this.abaAtual);
  }

  getUsuario(){
    return this.UsuarioSelecionadoAtual;
  }

  setUsuario(usuarioInformado ){
    this.UsuarioSelecionadoAtual = usuarioInformado;
    this.emitiUsuarioSelecionado.emit(this.UsuarioSelecionadoAtual);
  }

}
