import { Injectable, EventEmitter } from '@angular/core';
import { Proposta } from './proposta';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ComunicaPropostaService {

  emitiAba = new EventEmitter<number>();
  private abaAtual: number;

  emitiProposta = new EventEmitter<Proposta>();
  private propostaAtual: Proposta;
  
  constructor() { }

  getAba() {
    return this.abaAtual;
  };
  getProposta() {
    return this.propostaAtual;
  }

  setAba(abaInformada: number){
    this.abaAtual = abaInformada; 
    this.emitiAba.emit(this.abaAtual);
  }

  setProposta(propostaInformada: Proposta){
    this.propostaAtual = propostaInformada;
    this.emitiProposta.emit(this.propostaAtual)
  }

}
