import { Component, OnInit, HostListener, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

import { Usuario } from '../login/usuario';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { IMyOptions, ToastService } from '../../lib/ng-uikit-pro-standard';
import * as moment from 'moment';

@Component({
  selector: 'app-produtividade-call-center',
  templateUrl: './produtividade-call-center.component.html',
  styleUrls: ['./produtividade-call-center.component.scss']
})
export class ProdutividadeCallCenterComponent implements OnInit {


  prospects: string;
  tentando: any;
  predicoes: any;
  resultado: any;
  usuarioLogado: Usuario;
  agentesVendasSelect: Array<any>;
  agentesVendasSelectValue: string;

  campanhaSelect: Array<any>;
  campanhaSelectValue: string;

  eventosPendentesDepartamento: Array<any>;
  eventosPendentesUsuario: Array<any>;
  eventosTentandoUsuario: Array<any>;
  eventosTentandoDepartamento: Array<any>;
  eventosPredicaoUsuario: Array<any>;
  eventosPredicaoDepartamento: Array<any>;
  eventosResultadoUsuario: Array<any>;
  eventosResultadoDepartamento: Array<any>;

  dataInicial: string = moment().startOf('month').format('DD/MM/YYYY')
  dataFinal: string = moment().endOf('month').format('DD/MM/YYYY')



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
  radioModel: string = 'dtCompromisso';

  constructor(private http: Http, private connectHTTP: ConnectHTTP, private localStorage: LocalStorage,
    private toastrService: ToastService) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
  }

  async ngOnInit() {
    let agentesVendas = await this.connectHTTP.callService({
      service: 'getAgentesVendas',
      paramsService: {
        token: this.usuarioLogado.token,
        id_usuario: this.usuarioLogado.id,
        id_organograma: this.usuarioLogado.id_organograma,
      }
    });

    this.agentesVendasSelect = agentesVendas.resposta as Array<object>;
    this.agentesVendasSelect = this.agentesVendasSelect.map(agenteVenda => {
      return { value: agenteVenda.id_pessoa, label: agenteVenda.login }
    });

    this.agentesVendasSelectValue = this.agentesVendasSelect[0].value;
    
    // this.agentesVendasSelectValue = this.usuarioLogado.id_pessoa.toString ;

    // let campanha = await this.connectHTTP.callService({
    //   service: 'getCampanhas',
    //   paramsService: {
    //     token: this.usuarioLogado.token,
    //     id_usuario: this.usuarioLogado.id,
    //     id_organograma: this.usuarioLogado.id_organograma,
    //   }
    // });
    // this.campanhaSelect = campanha.resposta as Array<object>;
    // this.dataInicial = this.campanhaSelect[0].dt_inicio;
    // this.dataFinal =  this.campanhaSelect[0].dt_fim;
    // this.campanhaSelect = this.campanhaSelect.map(campanha => {
    //   return { value: campanha.id, label: campanha.nome }
    // })
    // this.campanhaSelectValue = this.campanhaSelect[0].value;

    this.produtividadeCallCenter();
  };


  async produtividadeCallCenter() {
    try {
      let getProdutividadeCallCenter = await this.connectHTTP.callService({
        service: 'getProdutividadeCallCenter',
        paramsService: {
          token: this.usuarioLogado.token,
          id_usuario: this.usuarioLogado.id,
          id_pessoa_usuario_select: this.agentesVendasSelectValue,
          id_organograma: this.usuarioLogado.id_organograma,
          id_campanha: 5,
          dtInicial: this.dataInicial,
          dtFinal: this.dataFinal
        }
      }) as any;
     
      console.log(getProdutividadeCallCenter);
      

      this.eventosPendentesDepartamento = getProdutividadeCallCenter.resposta.EventosPendentesDepartamento;
      this.eventosPendentesUsuario = getProdutividadeCallCenter.resposta.EventosPendentesUsuario;
      this.eventosTentandoDepartamento = getProdutividadeCallCenter.resposta.EventosTentandoDepartamento;
      this.eventosTentandoUsuario = getProdutividadeCallCenter.resposta.EventosTentandoUsuario;
      this.eventosPredicaoDepartamento = getProdutividadeCallCenter.resposta.EventosPredicaoDepartamento;
      this.eventosPredicaoUsuario = getProdutividadeCallCenter.resposta.EventosPredicao;
      this.eventosResultadoDepartamento = getProdutividadeCallCenter.resposta.EventosResultadoDepartamento;
      this.eventosResultadoUsuario = getProdutividadeCallCenter.resposta.EventosResultado;



    }
    catch (e) {
      this.toastrService.error(e.error);
    }
  };
}

