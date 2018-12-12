import { Injectable, EventEmitter } from '@angular/core';
import { Proposta } from './proposta';


@Injectable({
  providedIn: 'root'
})

export class ComunicaPropostaService {

  emitiAba = new EventEmitter<number>();
  private abaAtual: number;

  emitiProposta = new EventEmitter<Proposta>();
  private propostaAtual: Proposta;

  emitiPropostaJSON = new EventEmitter<any>();
  private propostaJSONAtual: any;

  constructor() { }

  getAba() {
    return this.abaAtual;
  };
  getProposta() {
    return this.propostaAtual.propostaObj();
  }

  getPropostaJSON() {
    return this.propostaJSONAtual;
  }

  setAba(abaInformada: number) {
    this.abaAtual = abaInformada;
    this.emitiAba.emit(this.abaAtual);
  }

  setProposta(propostaInformada: Proposta) {
    this.propostaAtual = propostaInformada;
    this.emitiProposta.emit(this.propostaAtual)
  }

  setPropostaJSON(propostaJSONInformada: any) {
    this.propostaJSONAtual = propostaJSONInformada;
    this.emitiPropostaJSON.emit(this.propostaJSONAtual)
  }

}
