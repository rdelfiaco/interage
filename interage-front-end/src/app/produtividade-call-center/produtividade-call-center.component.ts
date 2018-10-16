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
  usuarioLogado: any;
  agentesVendasSelect: Array<any>;
  agentesVendasSelectValue: string;
  agentesVendasSelectNome: string;
  agentesVendasSelectNomeTemp: string;

  campanhaSelect: Array<any>;
  campanhaSelectValue: string;

  eventosPendentesDepartamento: Array<any> = [];
  eventosPendentesUsuario: Array<any> = [];
  eventosTentandoUsuario: Array<any> = [];
  eventosTentandoDepartamento: Array<any> = [];
  eventosPredicaoUsuario: Array<any> = [];
  eventosPredicaoDepartamento: Array<any> = [];
  eventosResultadoUsuario: Array<any> = [];
  eventosResultadoDepartamento: Array<any> = [];

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
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;
  }

  async ngOnInit() {
    debugger
    let agentesVendas = await this.connectHTTP.callService({
      service: 'getAgentesVendas',
      paramsService: {
        token: this.usuarioLogado.token,
        id_usuario: this.usuarioLogado.id,
        id_organograma: this.usuarioLogado.id_organograma,
      }
    }) as any;

    this.agentesVendasSelect = agentesVendas.resposta as Array<object>;
    this.agentesVendasSelect = this.agentesVendasSelect.map(agenteVenda => {
      return { value: agenteVenda.id_pessoa, label: agenteVenda.nome }
    });

    debugger;
    if (this.usuarioLogado.responsavel_membro == 'M') {
      let agenteSelecionado = agentesVendas.resposta.filter(a => a.id_pessoa == this.usuarioLogado.id_pessoa)[0];

      this.agentesVendasSelectNome = agenteSelecionado.nome;
      this.agentesVendasSelectValue = agenteSelecionado.id_pessoa;
    }
    else {
      this.agentesVendasSelectNome = this.agentesVendasSelect[0].label;
      this.agentesVendasSelectValue = this.agentesVendasSelect[0].value;
    }

    this.produtividadeCallCenter();
  };
  setNomeAtendente(value) {
    this.agentesVendasSelectNomeTemp = value.label;
  }

  async produtividadeCallCenter() {
    const arrumaPredicoes = function arrumaPredicoes(resultadoPredicoes) {
      let ret = [];

      let predicaoFrio = resultadoPredicoes.filter((r) => {
        if (r.id == 1) return true;
      })[0]
      let predicaoMorno = resultadoPredicoes.filter((r) => {
        if (r.id == 2) return true;
      })[0]
      let predicaoQuente = resultadoPredicoes.filter((r) => {
        if (r.id == 3) return true;
      })[0]

      if (!predicaoFrio) ret.push({ nome: "Frio", id: 1, count: "0" })
      else ret.push(predicaoFrio)

      if (!predicaoMorno) ret.push({ nome: "Morno", id: 2, count: "0" })
      else ret.push(predicaoMorno)

      if (!predicaoQuente) ret.push({ nome: "Quente", id: 3, count: "0" })
      else ret.push(predicaoQuente)
      return ret;
    }

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

      this.agentesVendasSelectNome = this.agentesVendasSelectNomeTemp;
      this.eventosPendentesDepartamento = getProdutividadeCallCenter.resposta.EventosPendentesDepartamento;
      this.eventosTentandoDepartamento = getProdutividadeCallCenter.resposta.EventosTentandoDepartamento;

      this.eventosPredicaoDepartamento = arrumaPredicoes(getProdutividadeCallCenter.resposta.EventosPredicaoDepartamento);
      debugger;
      this.eventosResultadoDepartamento = getProdutividadeCallCenter.resposta.EventosResultadoDepartamento;


      this.eventosPendentesUsuario = getProdutividadeCallCenter.resposta.EventosPendentesUsuario;
      this.eventosTentandoUsuario = getProdutividadeCallCenter.resposta.EventosTentandoUsuario;
      this.eventosPredicaoUsuario = arrumaPredicoes(getProdutividadeCallCenter.resposta.EventosPredicaoUsuario);
      this.eventosResultadoUsuario = getProdutividadeCallCenter.resposta.EventosResultadoUsuario;
    }
    catch (e) {
      this.toastrService.error(e.error);
    }
  };

  async salvaProdutividadeCSV() {
    try {
      let getProdutividadeCallCenter = await this.connectHTTP.callService({
        service: 'getEventosRelatorioUsuario',
        paramsService: {
          token: this.usuarioLogado.token,
          id_usuario: this.usuarioLogado.id,
          id_pessoa_organograma: this.agentesVendasSelectValue,
          id_organograma: this.usuarioLogado.id_organograma,
          id_campanha: 5,
          dtInicial: this.dataInicial,
          dtFinal: this.dataFinal
        }
      }) as any;

      new Angular5Csv(getProdutividadeCallCenter.resposta, 'data-table', {
        headers: Object.keys(getProdutividadeCallCenter.resposta[0])
      });
    }
    catch (e) {
      this.toastrService.error(e.error);
    }
  }
}

