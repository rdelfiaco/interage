import { element } from 'protractor';
import { Component, OnInit, HostListener, QueryList, ElementRef, ViewChildren } from '@angular/core';
import { Usuario } from '../login/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { ToastService } from '../../lib/ng-uikit-pro-standard';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';


@Component({
  selector: 'app-show-table',
  templateUrl: './show-table.component.html',
  styleUrls: ['./show-table.component.scss']
})
export class ShowTableComponent implements OnInit {


  idSql: any;
  idRegistro: any;
  usuarioLogado: Usuario;
  tableData:  Array<any>;
  tableDataPage:  Array<any>;
  headElements: Array<any>;
  totalRegistros: number;
  titulo: string;
  dataInicial: string;
  dataFinal: string;
  colunas: string;
  filtros: string;
  rotaDetalhe: string;


  @ViewChildren('list') list: QueryList<ElementRef>;
  paginators: Array<any> = [];
  activePage: number = 1;
  firstVisibleIndex: number = 1;
  lastVisibleIndex: number = 10;
  url: any = 'https://jsonplaceholder.typicode.com/posts';
  sorted = false;
  searchText: string;
  firstPageNumber: number = 1;
  lastPageNumber: number;
  maxVisibleItems: number = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private connectHTTP: ConnectHTTP, 
    private localStorage: LocalStorage,
    private toastrService: ToastService) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.route.params.subscribe(res => {
      let parametros = res.parametros 
      parametros = JSON.parse(parametros);
      debugger
      this.idRegistro = parametros.idRegistro;
      this.idSql = parametros.idSql;
      this.titulo = parametros.titulo;
      this.dataInicial = parametros.dataInicial;
      this.dataFinal = parametros.dataFinal;
      this.colunas = parametros.colunas;
      this.filtros = parametros.filtros;
      this.rotaDetalhe = parametros.rotaDetalhe; 
      
    });
  };


  async ngOnInit() {
    debugger
    try {

      let getResultadoSQLs = await this.connectHTTP.callService({
        service: 'getSQL',
        paramsService: {
           
          token: this.usuarioLogado.token,
          idUsuarioLogado: this.usuarioLogado.id,
          idSql: this.idSql,
          idRegistro: this.idRegistro,
          dataInicial: this.dataInicial,
          dataFinal: this.dataFinal,
          colunas: this.colunas,
          filtros: this.filtros
        }
        
      });
      this.tableData = getResultadoSQLs.resposta as Array<object> ;
      this.totalRegistros = this.tableData.length;
      
      this.headElements = Object.keys(this.tableData[0]);

      this.defineNumeroPagina();
      
    }
    catch (e) {
      this.toastrService.error('Erro ao executar a SQL : ', e.error);
      this.tableData = [];
      
    }

  }

  voltar() {
    history.back();
  }

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

    this.activePage = +event.target.text;
    this.firstVisibleIndex = this.activePage * this.maxVisibleItems - this.maxVisibleItems + 1;
    this.lastVisibleIndex = this.activePage * this.maxVisibleItems;
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
    this.firstVisibleIndex = Math.abs((this.activePage * this.maxVisibleItems) - this.maxVisibleItems + 1);
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

  download(){

  new Angular5Csv(this.tableData, 'data-table', {
    fieldSeparator: ';',
    headers: Object.keys(this.tableData[0]),
    type: 'text/csv;charset=utf-8;'
  });

  }


  async abreDetalhe(id: any){
  
    if (this.rotaDetalhe == 'evento'){
      this.router.navigate([`/evento/${id}`]);
    }
  
    if (this.rotaDetalhe == 'proposta'){
      this.router.navigate([`/proposta/${id}`]);
    }
  
  
    }



}



