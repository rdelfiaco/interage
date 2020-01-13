import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Http } from '@angular/http';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { ToastService, IMyOptions } from '../../lib/ng-uikit-pro-standard';
import { Valida } from '../shared/services/valida';
import { BancoDados } from '../shared/services/bancoDados';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'; 

import { ReportPDF } from '../shared/services/reportPDF';


@Component({
  selector: 'app-atendimento-informacao',
  templateUrl: './atendimento-informacao.component.html',
  styleUrls: ['./atendimento-informacao.component.scss']
})
export class AtendimentoInformacaoComponent implements OnInit {

  usuarioLogado: any;
  usuariosSelect: Array<any>;
  usuarioSelectValue:  string;
  usuarioSelectNome: string;
  idPessoaDoUsuario: number;
  tableData: Array<any>;
  total: number;
  private sorted = false;


  dataInicial: string = moment().startOf('month').format('DD/MM/YYYY');
  dataFinal: string = moment().endOf('month').format('DD/MM/YYYY');

  propostas: Array<any> = [];
  propostaTodos: Array<any> = [];
  propostaIndividual: Array<any> = [];

  eventos: Array<any> = [];
  eventoTodos: Array<any> = [];
  eventoIndividual: Array<any> = [];
  eventosChart: any;
  propostaChart: any;

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




    constructor(
      private http: Http, 
      private connectHTTP: ConnectHTTP, 
      private localStorage: LocalStorage,
      private toastrService: ToastService, 
      private valida: Valida ,
      private bancoDados: BancoDados = new BancoDados,
      private reportPDF: ReportPDF = new ReportPDF

      ) {
         this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;
         pdfMake.vfs = pdfFonts.pdfMake.vfs;

        }

  async ngOnInit() {

    let usuarios  = await this.bancoDados.lerDados('getUsuarios',{ }) as any;
    if(!usuarios || usuarios.error) 
    {
    this.toastrService.error('Erro ao consultar pessoa   ');
    return;
    };

    this.usuariosSelect = usuarios.resposta as Array<object>;
    this.usuariosSelect = this.usuariosSelect.filter( result => {
      if(result.status) {
          return true;
      } 
    }).map(usuarios_ => {
      return { value: usuarios_.id_pessoa, label: usuarios_.nome }
    });


    this.usuarioSelectNome = this.usuariosSelect[0].label;
    this.usuarioSelectValue = this.usuariosSelect[0].value;
    


  };

  async getEventos( ){
    let eventos  = await this.bancoDados.lerDados('getInformacaoAtendimentos',
    {
      idPessoaDoUsuario: this.idPessoaDoUsuario,
      dataInicial: this.dataInicial,
      dataFinal: this.dataFinal

    }) as any;
    if(!eventos || eventos.error) 
    {
    this.toastrService.error('Erro eventos de atendimentos ');
    return;
    };

    this.tableData = eventos.resposta;
    this.total = 0;
    this.tableData.forEach(elem => {
      if (elem.total != null) this.total = this.total + elem.total;
    })
    if (this.tableData[0].motivo == null) this.tableData = [];
    // console.log(' this.total ',  this.total )
    // console.log('this.tableData ', this.tableData);

  }

  setNomeUsuario(usuarioSelecionado_){

    this.idPessoaDoUsuario = usuarioSelecionado_.value;
    this.usuarioSelectNome = usuarioSelecionado_.nome;
    this.getEventos();

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
    this.getEventos();
  };


  sortBy(by: string | any): void {
    this.tableData.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }

      return 0;
    });

    this.sorted = !this.sorted;
  }

  gerarPDF(){
    debugger
    let titulo = `Motivos de atendimentos entre ${this.dataInicial} a ${this.dataFinal} registrados por ${this.usuarioSelectNome}`;

    var detalhesColunas = [];
    var linhas = new Array();

    linhas.push('Motivo');
    linhas.push('Quantidade' );
    linhas.push('Percentual');
    detalhesColunas.push( linhas );

    this.tableData.forEach(element => {
      var linhas = new Array();
      linhas.push(element.motivo.toString());
      linhas.push(element.total.toString());
      linhas.push( element.perct.toString() + '%');

      detalhesColunas.push( linhas)
    })
    var linhas = new Array();
    linhas.push('Total');
    linhas.push(this.total.toString() );
    linhas.push('100%');


    detalhesColunas.push( linhas );
    var docDefinition = this.reportPDF.gerarPDF(titulo, detalhesColunas );
    pdfMake.createPdf( docDefinition ).open();

  }

}
