//import { timerasobservableTimer } from 'rxjs';
import { Component, OnInit, HostListener, QueryList, ElementRef, ViewChildren, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { Usuario } from '../../login/usuario';
import * as moment from 'moment';
import { IMyOptions, ToastService, ModalDirective } from '../../../lib/ng-uikit-pro-standard';
import { Valida } from '../../shared/services/valida';


@Component({
  selector: 'app-tarefa',
  templateUrl: './tarefa.component.html',
  styleUrls: ['./tarefa.component.scss']
})
export class TarefaComponent implements OnInit {

  usuarioLogado: Usuario;
  // motivo e tarefa são sinônimos  
  id_motivo: string;
  tarefa: string;
  indicadores: Array<any>;
  tarefasPendentes: Array<any>;
  totalEventos: number;
  usuarioLogadoSupervisor: boolean = true;
  tornarResponsavel: any;

  tmr: any;
  mat: any;
  met: any;


  dataInicial: string = moment().startOf('month').format('DD/MM/YYYY');
  dataFinal: string = moment().endOf('month').format('DD/MM/YYYY');


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
    fieldSeparator: ',',
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


  constructor(private route: ActivatedRoute,
    private connectHTTP: ConnectHTTP, 
    private localStorage: LocalStorage,
    private toastrService: ToastService, 
    private valida: Valida ,
    private router: Router,
    ) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.usuarioLogadoSupervisor = this.usuarioLogado.dashboard === "supervisor" || this.usuarioLogado.dashboard === "admin";
    this.route.params.subscribe(res => {
      this.id_motivo = res.id
    });
    
  }

  ngOnInit() {

    this.lerTarefa();
    this.lerTarefaPerformance();
 
  }

  async lerTarefa(){
    let tarefa_ = await this.connectHTTP.callService({
      service: 'getTarefaPorId',
      paramsService: {
        id_organograma: this.usuarioLogado.id_organograma,
        id: this.id_motivo,
      }
    }) as any;

    this.tarefa = tarefa_.resposta[0].nome;
    
  }

  async lerTarefaPerformance(){
    let tarefa_ = await this.connectHTTP.callService({
      service: 'getTarefaPerformance',
      paramsService: {
        id_organograma: this.usuarioLogado.id_organograma,
        id: this.id_motivo,
        dataInicial: this.dataInicial,
        dataFinal: this.dataFinal
      }
    }) as any;

  

    this.indicadores = tarefa_.resposta.tarefaIndicadores as Array<object>; 
    this.tmr = this.indicadores[0].tmr ? this.indicadores[0].tmr as Array<object> : 0;
    this.mat = this.indicadores[0].mat ? this.indicadores[0].mat : 0;
    this.met = this.indicadores[0].met ? this.indicadores[0].met : 0;
    this.tarefasPendentes = tarefa_.resposta.tarefasPendentes;
    if (this.tmr == 0 ) this.toastrService.warning ('Não tem tarefas concluidas no periodo')

    if (tarefa_.error) this.tableData = [];
    else this.tableData = tarefa_.resposta.tarefasPendentes as Array<object>;

    this.totalEventos = this.tableData.length;
    this.defineNumeroPagina();    

  }

  validaData(dataAlterada: string){
    var validacao = this.valida.dataIncialFinal( this.dataInicial,this.dataFinal)
    if (!validacao.resultado){
      this.toastrService.error(validacao.mensagem)
      if (dataAlterada == 'dtInicial' ){
        this.dataInicial = moment().startOf('month').format('DD/MM/YYYY');
      }else{
        this.dataFinal = moment().endOf('month').format('DD/MM/YYYY');
      }
    }
    this.lerTarefaPerformance();
  }

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
  else this.toastrService.error("Você não tem permissão de visualizar esse evento!" );
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



}
