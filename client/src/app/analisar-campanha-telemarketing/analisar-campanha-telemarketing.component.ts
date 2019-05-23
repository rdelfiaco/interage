import { Component, OnInit, HostListener, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { Usuario } from '../login/usuario';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import {  ToastService } from '../../lib/ng-uikit-pro-standard';
import { Router } from '@angular/router';


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
  tableData_ = [];
  sorted = false;
  searchText: string;
  firstPageNumber: number = 1;
  lastPageNumber: number;
  maxVisibleItems: number = 10;


    constructor(private http: Http, 
      private connectHTTP: ConnectHTTP, 
      private localStorage: LocalStorage,
      private toastrService: ToastService,
      private router: Router, 
      ) {
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
    this.tableData_ = campanha.resposta as Array<object>;
    // os campos que são numericos devem ser converditos para dar certa a ordenação 
    this.tableData_.forEach( aux => {
      this.tableData.push(
          { nome: aux.nome,
            inseridos: Number(aux.inseridos),
            pendentes: Number(aux.pendentes),
            contatando: Number(aux.contatando),
            concluidos : Number(aux.concluidos ),
            propostas_solicitadas : Number(aux.propostas_solicitadas ),
            ligacoes_realizadas : Number(aux.ligacoes_realizadas ),
            media_ligacoes_por_cliente_concluidos : Number(aux.media_ligacoes_por_cliente_concluidos ),
            dt_primeira_ligacao : Date.parse(aux.dt_primeira_ligacao ),
            dt_ultima_ligacao : Date.parse(aux.dt_ultima_ligacao ),
            dtInicial: aux.dt_primeira_ligacao,
            dtFinal: aux.dt_ultima_ligacao ,
            id_campanha : Number(aux.id ),
          }
      )
    })
    this.defineNumeroPagina();    
  }


  abreDetalheCampanha(evento){

    let nomeCampanha = evento.nome.split('/').join(' ');
    let dataInicial = evento.dtInicial.split('/').join('-');
    let dataFinal = evento.dtFinal.split('/').join('-');
    this.router.navigate([`/detalheDeCampanha/{"idCampanha":${evento.id_campanha}, "nome":"${nomeCampanha}", "dataInicial":"${dataInicial}", "dataFinal":"${dataFinal}" }`]);
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
