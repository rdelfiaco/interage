import { Component, OnInit, HostListener, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

import { Usuario } from '../login/usuario';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { IMyOptions, ToastService, ModalDirective } from '../../lib/ng-uikit-pro-standard';

import * as moment from 'moment';
import { Router } from '@angular/router';

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
  departamentoSelectValue: number;
  usuarioSelectValue: number;
  motivoSelectValue: Array<any>;
  statusSelectValue: Array<any>;
  eventosUsuarioChk: boolean = false;
  eventosFinalizadosChk: boolean = true;
  dtCricaoRadio: boolean = false;
  dtCompromissoRadio: boolean = true;
  enviadoPorRadio: boolean = false;
  recebidoPorRadio: boolean = true;
  usuarioLogadoSupervisor: boolean = true;
  eventoFiltros: any;
  tornarResponsavel: any;
  totalEventos: number = 0;

  dataInicial: string = moment().subtract(1, 'days').format('DD/MM/YYYY')
  dataFinal: string = moment().add(1, 'days').format('DD/MM/YYYY')



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

  constructor(private http: Http, private connectHTTP: ConnectHTTP,
    private toastrService: ToastService, private localStorage: LocalStorage, private router: Router) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.usuarioLogadoSupervisor = this.usuarioLogado.dashboard === "supervisor" || this.usuarioLogado.dashboard === "admin";
  }

  async ngOnInit() {
    this.eventoFiltros = await this.connectHTTP.callService({
      service: 'getEventoFiltros',
      paramsService: {
        id_organograma: this.usuarioLogado.id_organograma
      }
    }) as any;

    // combo departamento 
    this.departamentoSelect = this.eventoFiltros.resposta.Organograma;
    this.departamentoSelect = this.departamentoSelect.map(departamento => {
      return { value: departamento.id, label: departamento.nome }
    });


    this.departamentoSelectValue = Number(this.usuarioLogado.id_organograma);

    // combo usuário

    this.comboUsuarios()
    this.usuarioSelectValue = this.usuarioLogado.id


    // combo motivos
    this.motivoSelect = this.eventoFiltros.resposta.Motivos;

    this.motivoSelect = this.motivoSelect.map(motivos => {
      return { value: motivos.id, label: motivos.nome }
    });

    this.motivoSelect.push({ value: -1, label: "Todos" });

    this.motivoSelectValue = [-1]

    // combo status_evento
    this.statusSelect = this.eventoFiltros.resposta.StatusEvento;
    this.statusSelect = this.statusSelect.map(status => {
      return { value: status.id, label: status.nome }
    });

    this.statusSelectValue = [1, 4, 5, 6];


    this.listaEventos();


  }

  @ViewChild('modalCriarEvento') modalCriarEvento: ModalDirective;
  @ViewChild('confirmSeTornarResponsavelModal') confirmSeTornarResponsavelModal: ModalDirective;

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



  async listaEventos() {
    
    try {
      let usuarioIdPessoa = this.usuarioSelect.filter(usuario => {
        if (usuario.value == this.usuarioSelectValue) {
          return usuario.idPessoa
        }
      })
      let usuarioIdPessoa_ = usuarioIdPessoa[0].idPessoa
      let eventos = await this.connectHTTP.callService({
        service: 'getEventosFiltrados',
        paramsService: {
          id_organograma: this.usuarioLogado.id_organograma,
          dt_inicial: this.dataInicial,
          dt_final: this.dataFinal,
          responsavel_membro: this.usuarioLogado.responsavel_membro,
          departamentos: this.departamentoSelectValue,
          idusuarioSelecionado: this.usuarioSelectValue,
          motivos: this.motivoSelectValue,
          status: this.statusSelectValue,
          eventosUsuarioChk: this.eventosUsuarioChk,
          dtCricaoRadio: this.dtCricaoRadio,
          recebidoPorRadio: this.recebidoPorRadio,
          usuarioIdPessoa: usuarioIdPessoa_

        }
        
      }) as any;
      console.log('kkkk')
      if (eventos.error) this.tableData = [];
      else this.tableData = eventos.resposta as Array<object>;
    }
    catch (e) {
      this.toastrService.error('Erro em getEventosFiltrados : ', e.error);
      this.tableData = [];
    }
    this.totalEventos = this.tableData.length;
    this.defineNumeroPagina();
  }

  async abreEvento(evento: any) {
    const pessoaQueResolvelOEvento = (this.usuarioLogado.id_pessoa === evento.id_pessoa_resolveu);
    const eventoParaPessoaLogada = (evento.tipodestino === "P" && this.usuarioLogado.id_pessoa === evento.id_pessoa_organograma);
    const eventoParaPessoaOrgonogramaLogada = (evento.tipodestino === "O" && this.usuarioLogado.id_organograma === evento.id_pessoa_organograma);

    if (evento.id_status_evento == 1 || evento.id_status_evento == 4) {
      if (eventoParaPessoaLogada) {
        await this.connectHTTP.callService({
          service: 'visualizarEvento',
          paramsService: {
            id_evento: evento.id,
            id_pessoa_visualizou: this.usuarioLogado.id_pessoa
          }
        }) as any;
        this.router.navigate([`/evento/${evento.id}`]);
      }
      else if (this.usuarioLogadoSupervisor || eventoParaPessoaOrgonogramaLogada) {
        this.tornarResponsavel = evento;
        this.confirmSeTornarResponsavelModal.show();
      }
      else
        this.toastrService.error("Você não pode visualizar esse evento!");
    }
    else {
      this.router.navigate([`/evento/${evento.id}`]);
    }
  }

  async visualizarEvento() {
    if (this.usuarioLogadoSupervisor) {
      this.router.navigate([`/evento/${this.tornarResponsavel.id}`]);
      this.tornarResponsavel = null;
    }
    else this.toastrService.error("Você não tem permissão de visualizar esse evento!");
  }

  cancelaSeTornarResponsavel() {
    this.tornarResponsavel = null;
    this.toastrService.error("Você não assumiu a responsabilidade não tem permissão para visualizar");
  }

  async confirmaSeTornarResponsavel() {
    try {
      await this.connectHTTP.callService({
        service: 'visualizarEvento',
        paramsService: {
          id_evento: this.tornarResponsavel.id,
          id_pessoa_visualizou: this.usuarioLogado.id_pessoa
        }
      }) as any;
      var self = this;
      setTimeout(() => {
        self.tornarResponsavel = null;
      }, 100)
      this.router.navigate([`/evento/${this.tornarResponsavel.id}`]);
    }
    catch (e) {
      this.toastrService.error('Erro em visualizarEvento: ', e.error);
    }
  }

  generateCsv() {
    new Angular5Csv(this.tableData, 'data-table', {
      fieldSeparator: ';',
      headers: Object.keys(this.tableData[0])
    });
  }

  fechaModal() {
    this.modalCriarEvento.hide();
  }

  tipoDeData(tipoData: any) {
    if ('dtCompromissoRadio' === tipoData) {
      this.dtCompromissoRadio = true;
      this.dtCricaoRadio = false;
      this.listaEventos();
    }
    else {
      this.dtCompromissoRadio = false;
      this.dtCricaoRadio = true;
      this.eventosUsuarioChk = true;
      this.listaEventos();
    }
  }

  comboUsuarios() {

    this.usuarioSelect = this.eventoFiltros.resposta.Usuarios;
    this.usuarioSelect = this.usuarioSelect.filter(usuario => {
      if (usuario.id_organograma == this.departamentoSelectValue) {
        return usuario
      }
    })
    this.usuarioSelect = this.usuarioSelect.map(usuario => {
      return { value: usuario.id, label: usuario.nome, idPessoa: usuario.id_pessoa }
    });

    this.usuarioSelectValue = this.usuarioSelect[0].value;
  }

  onChangeDepartamento() {

    this.comboUsuarios()

    this.listaEventos()

  }

  onChangeEventosUsuarioChk(eventosUsuarioChk_: any) {
    if (eventosUsuarioChk_) {
      this.eventosUsuarioChk = false
      this.listaEventos()
    } else {
      this.eventosUsuarioChk = true
      this.listaEventos()
    }



  }

  onSelectedMotivos() {


  }



}

