import { Component, OnInit, HostListener, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

import { Usuario } from '../login/usuario';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { IMyOptions } from '../../lib/ng-uikit-pro-standard';

import * as moment from 'moment';


@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.scss']
})
export class EventoComponent implements OnInit {

  usuarioLogado: Usuario;
  usuarioSelect: Array<any>;
  departamentoSelect: Array<any>;
  motivoSelect: Array<any>;
  statusSelect: Array<any>;
  departamentoSelectValue: Array<number>;
  usuarioSelectValue: number;
  motivoSelectValue : number;
  statusSelectValue : number;
  eventosUsuarioChk: boolean = true;
  eventosFinalizadosChk: boolean = true;
  dtCricaoRadio:  boolean = false;
  dtCompromissoRadio:  boolean = true;
  enviadoPorRadio:  boolean = false;
  recebidoPorRadio:  boolean = true;

  dataInicial: string = moment().subtract(1, 'days').format('DD/MM/YYYY')
  dataFinal: string  =  moment().add(1, 'days').format('DD/MM/YYYY')
  


  public myDatePickerOptions: IMyOptions = {
    // Strings and translations
    dayLabels: { su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sab' },
    dayLabelsFull: { su: "Domingo", mo: "Segunda", tu: "Terça", we: "Quarta", th: "Quinta", fr: "Sexta", sa: "Sábado" },
    monthLabels: { 1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez' },
    monthLabelsFull: { 1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril", 5: "Maio", 6: "Junho", 7: "Julho", 8: "Agosto", 9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro" },

    // Buttons
    todayBtnTxt: "Hoje",
    clearBtnTxt: "Limpar",
    closeBtnTxt: "Fechar",
    closeAfterSelect: true,

    // Format
    dateFormat: 'dd/mm/yyyy',
    selectionTxtFontSize: '15px',
    
  }

  options = {
    fieldSeparator: ';',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    useBom: true,
    headers: ['Post ID', 'Post title', 'Post body']
  };


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

  constructor(private http: Http, private connectHTTP: ConnectHTTP, private localStorage: LocalStorage) { 
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;


  }

  async ngOnInit() {
    console.log( this.usuarioLogado )
    console.log(this.usuarioLogado.id_organograma)
    console.log(  moment().format('DD/MM/YYYY') );

    let eventoFiltros = await this.connectHTTP.callService({
      service: 'getEventoFiltros',
      paramsService: {
        token: this.usuarioLogado.token,
        id_usuario: this.usuarioLogado.id,        
        id_organograma: this.usuarioLogado.id_organograma
      }
    });

    console.log( eventoFiltros.resposta  );

    // combo departamento 
    this.departamentoSelect = eventoFiltros.resposta.Organograma;
    this.departamentoSelect = this.departamentoSelect.map(departamento => {
      return { value: departamento.id, label: departamento.nome }
    });

    this.departamentoSelectValue = [this.usuarioLogado.id_organograma];

    // combo usuário
    this.usuarioSelect = eventoFiltros.resposta.Usuarios;
    this.usuarioSelect = this.usuarioSelect.map(usuario => {
      return { value: usuario.id, label: usuario.nome }
    });

    this.usuarioSelectValue =  this.usuarioLogado.id_pessoa;


    // combo motivos
    this.motivoSelect = eventoFiltros.resposta.Motivos;
    this.motivoSelect = this.motivoSelect.map(motivos => {
      return { value: motivos.id, label: motivos.nome }
    });

    this.motivoSelectValue =  1

    // combo status_evento
    this.statusSelect = eventoFiltros.resposta.StatusEvento;
    this.statusSelect = this.statusSelect.map(status => {
      return { value: status.id, label: status.nome }
    });

    this.statusSelectValue =  1;


    this.listaEventos();


  }


  @HostListener('input') oninput() {
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

  generateCsv() {
    new Angular5Csv(this.search(), 'data-table', this.options);
  }

  async listaEventos(){

    let eventos = await this.connectHTTP.callService({
      service: 'getEventosFiltrados',
      paramsService: {
        token: this.usuarioLogado.token,
        id_usuario: this.usuarioLogado.id,        
        id_organograma: this.usuarioLogado.id_organograma,
        dt_inicial: this.dataInicial,
        dt_final: this.dataFinal,
        responsavel_membro: this.usuarioLogado.responsavel_membro,
        departamentos: this.departamentoSelectValue,
        usuarios: this.usuarioSelectValue,
        motivos: this.motivoSelectValue,
        status: this.statusSelectValue,
        eventosUsuarioChk: this.eventosUsuarioChk, 
        dtCricaoRadio: this.dtCricaoRadio
        
      }
    });
    
    this.tableData = eventos.resposta as Array<object> ;

  }

}

