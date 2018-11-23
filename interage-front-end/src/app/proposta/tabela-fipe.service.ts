import { EventEmitter } from '@angular/core';
import { TabelaFipe } from './tabela-fipe';
import { Injectable } from '@angular/core';


@Injectable()

export class TabelaFipeService {

  emitirTabelaFipe = new EventEmitter<TabelaFipe>();
  //static mudouTabelaFipe = new EventEmitter<TabelaFipe>();

  private tabelaFipe: TabelaFipe;

  constructor() { 

  };

  getTabelaFipe() {
    console.log('Obtendo lista de cursos');
    return this.tabelaFipe;
  };

  setCurso(_tabelaFipe: TabelaFipe){
    this.tabelaFipe = _tabelaFipe; 
    this.emitirTabelaFipe.emit(_tabelaFipe);
    //TabelaFipeService.mudouTabelaFipe.emit(_tabelaFipe);
}
  

}
