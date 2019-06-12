import { BancoDados } from './../shared/services/bancoDados';
import { Injectable, EventEmitter } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';

@Injectable({
  providedIn: 'root'
})
export class CrudCampanhaService {


  private connectHTTP: ConnectHTTP;
  private localStorage: LocalStorage;
  private bancoDados: BancoDados = new BancoDados;
  
  constructor() { }
  
  emitiAba = new EventEmitter<number>();
  private _abaAtual: number;
  public get abaAtual(): number {
    return this._abaAtual;
  }
  public set abaAtual(value: number) {
    this._abaAtual = value;
    this.emitiAba.emit(this._abaAtual);

  }
  
  emitiCampanhaSelecionada = new EventEmitter<object>();
  private _campanhaSelecionadoAtual: object; 
  public get campanhaSelecionadoAtual(): object {
    return this._campanhaSelecionadoAtual;
  }
  public set campanhaSelecionadoAtual(value: object) {
    this._campanhaSelecionadoAtual = value;
    this.emitiCampanhaSelecionada.emit(this._campanhaSelecionadoAtual);
  }

  emitiCampanhas = new EventEmitter<object>();
  private _campanhas: object;
  public get campanhas(): object {
    return this._campanhas;
  }
  public set campanhas(value: object) {
    this._campanhas = value;
    this.emitiCampanhas.emit(this._campanhas)
  }

  emitiUsuarios = new EventEmitter<object>();
  private _usuarios: object;
  public get usuarios(): object {
    return this._usuarios;
  }
  public set usuarios(value: object) {
    this._usuarios = value;
    this.emitiUsuarios.emit(this._usuarios)
  }

  emitQuestionarios = new EventEmitter<object>();
  private _questionarios: object;
  public get questionarios(): object {
    return this._questionarios;
  }
  public set questionarios(value: object) {
    this._questionarios = value;
    this.emitQuestionarios.emit(this._questionarios);
  }

  emitCanais = new EventEmitter<object>();
  private _canais: any;
  public get canais(): any {
    return this._canais;
  }
  public set canais(value: any) {
    this._canais = value;
    this.emitCanais.emit(this._canais);
  }

  // public async setcanais() {
  //   this._canais = await this.bancoDados.lerDados('getCanais', { } ) as any; 
  // }
  
  emitMotivos = new EventEmitter<object>();
  private _motivos: Object;
  public get motivos(): Object {
    return this._motivos;
  }
  public set motivos(value: Object) {
    this._motivos = value;
    this.emitMotivos.emit(this._canais);
  }

  


}
