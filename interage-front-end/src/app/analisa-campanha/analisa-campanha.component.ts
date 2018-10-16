import { Component, OnInit, HostListener, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

import { Usuario } from '../login/usuario';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { IMyOptions, ToastService } from '../../lib/ng-uikit-pro-standard';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-analisa-campanha',
  templateUrl: './analisa-campanha.component.html',
  styleUrls: ['./analisa-campanha.component.scss']
})
export class AnalisaCampanhaComponent implements OnInit {

  prospects: string;
  tentando: any;
  predicoes: any;
  resultado: any;
  usuarioLogado: Usuario;
  agentesVendasSelect: Array<any>;
  campanhaSelect: Array<any>;
  analisaCampanhaTabela: Array<any>;
  prospectsResposta: Array<any>;
  tentandoResposta: Array<any>;
  agentesVendasSelectValue: string;
  campanhaSelectValue: string;
  dataInicial: string //= moment().format('DD/MM/YYYY')
  dataFinal: string //= moment().format('DD/MM/YYYY')



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

    let campanha = await this.connectHTTP.callService({
      service: 'getCampanhas',
      paramsService: {
        token: this.usuarioLogado.token,
        id_usuario: this.usuarioLogado.id,
        id_organograma: this.usuarioLogado.id_organograma,
      }
    });
    this.campanhaSelect = campanha.resposta as Array<object>;
    this.dataInicial = this.campanhaSelect[0].dt_inicio;
    this.dataFinal = this.campanhaSelect[0].dt_fim;
    this.campanhaSelect = this.campanhaSelect.map(campanha => {
      return { value: campanha.id, label: campanha.nome }
    })
    this.campanhaSelectValue = this.campanhaSelect[0].value;

    this.analisarCampanha();
  };


  async analisarCampanha() {
    try {
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

      let analisarCampanha = await this.connectHTTP.callService({
        service: 'getCampanhaAnalisar',
        paramsService: {
          token: this.usuarioLogado.token,
          id_usuario: this.usuarioLogado.id,
          id_organograma: this.usuarioLogado.id_organograma,
          id_campanha: this.campanhaSelectValue,
          dtInicial: this.dataInicial,
          dtFinal: this.dataFinal
        }
      }) as any;
      this.prospects = analisarCampanha.resposta.campanhaProspects[0].prospects;
      this.tentando = analisarCampanha.resposta.campanhaTentando;
      this.predicoes = arrumaPredicoes(analisarCampanha.resposta.campanhaPredicoes);
      this.resultado = analisarCampanha.resposta.campanhaResultado;
    }
    catch (e) {
      this.toastrService.error(e.error);
    }
  }
  async salvaCampanhaCSV() {
    try {
      let getCampanhaCallCenter = await this.connectHTTP.callService({
        service: 'getEventosRelatorioCampanha',
        paramsService: {
          token: this.usuarioLogado.token,
          id_usuario: this.usuarioLogado.id,
          id_campanha: this.campanhaSelectValue,
        }
      }) as any;

      debugger;
      new Angular5Csv(getCampanhaCallCenter.resposta, 'data-table', {
        headers: Object.keys(getCampanhaCallCenter.resposta[0])
      });
    }
    catch (e) {
      this.toastrService.error(e.error);
    }
  }
}