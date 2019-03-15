import { Component, OnInit, HostListener, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

import { Usuario } from '../login/usuario';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import {  ToastService } from '../../lib/ng-uikit-pro-standard';
import * as numeral from 'numeral';

import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-analisar-campanha-telemarketing',
  templateUrl: './analisar-campanha-telemarketing.component.html',
  styleUrls: ['./analisar-campanha-telemarketing.component.scss']
})
export class AnalisarCampanhaTelemarketingComponent implements OnInit {

  usuarioLogado: Usuario;
  campanhaTelemarketing: Array<any>;



  @ViewChildren('list') list: QueryList<ElementRef>;
  paginators: Array<any> = [];
  activePage: number = 1;
  firstVisibleIndex: number = 1;
  lastVisibleIndex: number = 10;
  url: any = 'https://jsonplaceholder.typicode.com/posts';
  tableData = [];
  sorted = false;
  searchText: string;
  firstPageNumber: number = 1;
  lastPageNumber: number;
  maxVisibleItems: number = 10;


    constructor(private http: Http, private connectHTTP: ConnectHTTP, private localStorage: LocalStorage,
    private toastrService: ToastService) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
  }

  async ngOnInit() {

    let campanha = await this.connectHTTP.callService({
      service: 'getCampanhaTelemarketing',
      paramsService: {
        token: this.usuarioLogado.token,
        idUsuarioLogado: this.usuarioLogado.id,
        }
    });
    this.campanhaTelemarketing = campanha.resposta as Array<object>;
    console.log(this.campanhaTelemarketing)

    this.tableData = campanha.resposta as Array<object>;

    this.defineNumeroPagina();    
  }


  listaInseridos(campanha: any){
      console.log(campanha)

  }

  listaPendentes(campanha: any){
    console.log(campanha)

  }

  listaConclidos(campanha: any){
    console.log(campanha)

  }
  listaLigacoesRealizadas(campanha: any){
    console.log(campanha)

  }








  // contrele de paginação e sorte da tabela list 

  @HostListener('input') oninput() {
    this.defineNumeroPagina();
}

defineNumeroPagina(){
  this.paginators = [];
  for (let i = 1; i <= this.search().length; i++) {
    if (!(this.paginators.indexOf(Math.ceil(i / this.maxVisibleItems)) !== -1)) {
      this.paginators.push(Math.ceil(i / this.maxVisibleItems));
    }
  }
  this.lastPageNumber = this.paginators.length;
}

changePage(event: any) {
  if (event.target.text >= 1 && event.target.text <= this.maxVisibleItems) {
    this.activePage = +event.target.text;
    this.firstVisibleIndex = this.activePage * this.maxVisibleItems - this.maxVisibleItems + 1;
    this.lastVisibleIndex = this.activePage * this.maxVisibleItems;
  }
}

nextPage() {
  this.activePage += 1;
  this.firstVisibleIndex = this.activePage * this.maxVisibleItems - this.maxVisibleItems + 1;
  this.lastVisibleIndex = this.activePage * this.maxVisibleItems;
}
previousPage() {
  this.activePage -= 1;
  this.firstVisibleIndex = this.activePage * this.maxVisibleItems - this.maxVisibleItems + 1;
  this.lastVisibleIndex = this.activePage * this.maxVisibleItems;
}

firstPage() {
  this.activePage = 1;
  this.firstVisibleIndex = this.activePage * this.maxVisibleItems - this.maxVisibleItems + 1;
  this.lastVisibleIndex = this.activePage * this.maxVisibleItems;
}

lastPage() {
  this.activePage = this.lastPageNumber;
  this.firstVisibleIndex = this.activePage * this.maxVisibleItems - this.maxVisibleItems + 1;
  this.lastVisibleIndex = this.activePage * this.maxVisibleItems;
}

sortBy(by: string | any): void {
  // if (by == 'dt_criou') {
  //   this.search().reverse();
  // } else {
  this.tableData.sort((a: any, b: any) => {
    if (a[by] < b[by]) {
      return this.sorted ? 1 : -1;
    }
    if (a[by] > b[by]) {
      return this.sorted ? -1 : 1;
    }
    return 0;
  });
  //}
  this.sorted = !this.sorted;
}

filterIt(arr: any, searchKey: any) {
  return arr.filter((obj: any) => {
    return Object.keys(obj).some((key) => {
      return obj[key].includes(searchKey);
    });
  });
}

search() {

  if (!this.searchText) {
    return this.tableData;
  }

  if (this.searchText) {
    return this.filterIt(this.tableData, this.searchText);
  }
}




}




// tem algumas funções de manipulação de arry importatnes 
//   usuarioLogado: Usuario;
//   campanhaSelectValue: string;
//   campanhaSelect: Array<any>;
//   clientesPendentes: Array<any> = [];
//   ligacoesRealizadas: Array<any>  = [];
//   clientesConcluidos: Array<any>  = [];
//   pessoa_resolveu: Array<any>  = [];
//   pessoaResolveu: Array<any> ;
//   campanhaAnalitica: Array<object>; 

//   totalClienteDaCampanha: number = 0;
//   totalClientesPendentes: number = 0;
//   totalClientesConcluidos: number = 0;
//   totalLigacoesRealizadas: number = 0;
//   mediaDeligacoesPorCliente: number = 0;







//   async analisaCampanha(){
//     let campanhaSelecionada = this.campanhaSelect.filter(campanha => {
//       if (this.campanhaSelectValue == campanha.value) {
//         return campanha;
//       }
//     })

//     this.totalClienteDaCampanha = Number(campanhaSelecionada[0].totClientesInseridos);

//     let campanha = await this.connectHTTP.callService({
//       service: 'getCampanhaTelemarketingAnalisar',
//       paramsService: {
//         token: this.usuarioLogado.token,
//         idUsuarioLogado: this.usuarioLogado.id,
//         idCampanha: campanhaSelecionada[0].idCampanha,
//         dtCriou: campanhaSelecionada[0].dtCriou
//         }
//     });

//     this.clientesPendentes = campanha.resposta.clientesPendentes;
//     this.totalClientesPendentes =  this.clientesPendentes.length ? this.clientesPendentes.length : 0; 
    
//     this.ligacoesRealizadas = campanha.resposta.ligacoesRealizadas;
//     this.totalLigacoesRealizadas =  this.ligacoesRealizadas.length ? this.ligacoesRealizadas.length : 0;

//     this.clientesConcluidos = campanha.resposta.clientesConcluidos;
//     this.totalClientesConcluidos = this.clientesConcluidos.length ? this.clientesConcluidos.length : 0;

//     this.mediaDeligacoesPorCliente = numeral(this.totalLigacoesRealizadas / this.totalClientesConcluidos).format('0.0000');

//     console.log(this.ligacoesRealizadas)

//     // agrupa as ligações realizadas por pessoa_resolveu

//     this.pessoa_resolveu = [];
//     for (let obj of this.ligacoesRealizadas) { 
//       if (!this.pessoa_resolveu.includes(obj.pessoa_resolveu)){
//           this.pessoa_resolveu.push(obj.pessoa_resolveu);
//     }
//     }
  
// //agrupar os valores por pessoa_resolveu com reduce
//   this.pessoaResolveu = this.ligacoesRealizadas.reduce((acc, val) => {
//     let index = acc.map((o) => o.name).indexOf(val.pessoa_resolveu); //posicao a pessoa_resolveu
//     if (index === -1){ //se não existe 
//         let newPessoaResolveu = {
//             name: val.pessoa_resolveu,
//             totalLigacoes: 1,
//             tempo_gasto_resolveu_ss: val.tempo_gasto_resolveu_ss,
//             tempo_medio_atendimento: '00:00'
//         }; 
//         acc.push(newPessoaResolveu); //e adiciona o novo objeto 
//     }
//     else { 
//         acc[index].totalLigacoes = acc[index].totalLigacoes + 1 ; //troca só o valor na data
//         acc[index].tempo_gasto_resolveu_ss = acc[index].tempo_gasto_resolveu_ss + val.tempo_gasto_resolveu_ss
//     }
//     return acc;
//   }, []); //inicia o reduce com array vazio

// // formata o tempo gasto de SS para MM:SS

//  this.pessoaResolveu.forEach(aux => {
//     let tmaSS = aux.tempo_gasto_resolveu_ss  / aux.totalLigacoes
//     let mi = Math.floor( tmaSS / 60);
//     let ss =  Math.floor( tmaSS  -   (mi * 60))
//     let mi_ss = mi.toString() + ':' + ss.toString()
//     aux.tempo_medio_atendimento = mi_ss;
// })
//   console.log(this.pessoaResolveu)
  
    
//   }

// }
