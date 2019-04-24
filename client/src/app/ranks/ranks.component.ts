import { MouseEvent } from './../../lib/ng-uikit-pro-standard/free/utils/facade/browser';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { IMyOptions, ToastService } from '../../lib/ng-uikit-pro-standard';
import { ChartsModule, ChartSimpleModule, WavesModule } from 'ng-uikit-pro-standard'
import { Http } from '@angular/http';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { Valida } from '../shared/services/valida';
import { Router } from '@angular/router';
import * as Chart from 'chart.js/dist/Chart';



@Component({
  selector: 'app-ranks',
  templateUrl: './ranks.component.html',
  styleUrls: ['./ranks.component.scss']
})
export class RanksComponent implements OnInit {

  usuarioLogado: any;
  prospeccao: Array<any> = []; // total de eventos com  motivo prospecção de cada usuario 
  propostaEmitidas: Array<any> = [];
  tableData = [];
  sorted = false;

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

  labels: Array<any> = [];
  datasets: Array<any> = [];
  label: Array<any> = [] ;
  data: Array<any> = [];
  backgroundColor: Array<any> = [];
  borderColor: Array<any> = [];
  ctxProspeccaoChart: any;
  myChartProspecao: any;
  myChartProposta: any;

  constructor(
        private http: Http, 
        private connectHTTP: ConnectHTTP, 
        private localStorage: LocalStorage,
        private toastrService: ToastService, 
        private valida: Valida,
        private router: Router
        ) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;
    }

  ngOnInit() {

    this.ctxProspeccaoChart = document.getElementById('ProspeccaoChart');

    this.getRanks()
    
   
   

  }


  async getRanks(){

    
    let retorno = await this.connectHTTP.callService({
      service: 'getRanks',
      paramsService: {
        token: this.usuarioLogado.token,
        id_usuario: this.usuarioLogado.id,
        dataInicial: this.dataInicial,
        dataFinal: this.dataFinal
      }
    }) as any;
    
    this.prospeccao = retorno.resposta.prospeccao;  
    this.propostaEmitidas = retorno.resposta.propostasEmitidas;
    this.tableData = retorno.resposta.ProspeccaoSolicitouProposta;

    this.montaGraficoProspeccao();
    if (this.myChartProspecao == undefined || this.myChartProspecao == null) {
        this.graficoProspeccao('bar','prospeccaoChart', this.router);
    }else {
        this.myChartProspecao.destroy();
        this.graficoProspeccao('bar','prospeccaoChart', this.router);
    }

    this.montaGraficoPropostaEmitidas();
    if (this.myChartProposta == undefined || this.myChartProposta == null) {
        this.graficoPropostaEmitidas('bar','propostaEmitidasChart', this.router);
    }else {
        this.myChartProposta.destroy();
        this.graficoPropostaEmitidas('bar','propostaEmitidasChart', this.router);
    }
    
  };


  montaGraficoProspeccao(){

    // grafico prospecções
    this.labels = [];
    this.label = [];
    this.datasets = [];


    this.prospeccao.forEach( (value: any, index: number, array: any[]) =>{
        
        if (this.labels.indexOf(value.resposta_motivo)==-1) this.labels.push( value.resposta_motivo);
        
        if (this.label.indexOf(value.consultor)==-1 ) this.label.push( value.consultor);
        
    });
    var i;
    for ( i = 0; i < this.label.length; i++ ) {
      let _data = [];
      _data.length = this.labels.length
      let _backgroundColor = [];
      _backgroundColor.length = this.labels.length
      let _borderColor = [];
      _borderColor.length = this.labels.length
      this.prospeccao.forEach( (value: any, index: number, array: any[]) =>{
        if (this.label[i] == value.consultor ){
          _data[this.labels.indexOf(value.resposta_motivo)] = value.total;
          _backgroundColor[this.labels.indexOf(value.resposta_motivo)] = `rgba(${value.color_r}, ${value.color_g}, ${value.color_b}, 0.2)`;
          _borderColor[this.labels.indexOf(value.resposta_motivo)] = `rgba(${value.color_r}, ${value.color_g}, ${value.color_b}, 1)`
        }
      });
      this.datasets.push({
          label: this.label[i],
          data: _data,
          backgroundColor: _backgroundColor,
          borderColor: _borderColor,
          borderWidth: 1   
      })
    }
  }

  montaGraficoPropostaEmitidas(){  
    // grafico das propostas emitidas 
    this.labels = [];
    this.label = [];
    this.datasets = [];

    this.propostaEmitidas.forEach( (value: any, index: number, array: any[]) =>{
        
        if (this.labels.indexOf(value.status_proposta)==-1) this.labels.push( value.status_proposta);
        
        if (this.label.indexOf(value.consultor)==-1 ) this.label.push( value.consultor);
        
    });
    
    var i;
    for ( i = 0; i < this.label.length; i++ ) {
      let _data = [];
      _data.length = this.labels.length
      let _backgroundColor = [];
      _backgroundColor.length = this.labels.length
      let _borderColor = [];
      _borderColor.length = this.labels.length
      this.propostaEmitidas.forEach( (value: any, index: number, array: any[]) =>{
        if (this.label[i] == value.consultor ){
          _data[this.labels.indexOf(value.status_proposta)] = value.total;
          _backgroundColor[this.labels.indexOf(value.status_proposta)] = `rgba(${value.color_r}, ${value.color_g}, ${value.color_b}, 0.2)`;
          _borderColor[this.labels.indexOf(value.status_proposta)] = `rgba(${value.color_r}, ${value.color_g}, ${value.color_b}, 1)`
        }
      });
      this.datasets.push({
          label: this.label[i],
          data: _data,
          backgroundColor: _backgroundColor,
          borderColor: _borderColor,
          borderWidth: 1   
      })
    };
  };


  graficoProspeccao(tipoGrafico: string,  grafico: string, router_: Router, dataInicial_ = this.dataInicial, dataFinal_ = this.dataFinal){
  let router: Router;

  var ctx = document.getElementById(grafico);
  var labelsFiltro: any;
  var datasetsFiltro: any;

  this.myChartProspecao = new Chart(ctx, {
    type: tipoGrafico ,
    data: {
      labels: this.labels,
      datasets: this.datasets,
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      responsive: true,
      legend: { 
        display: true 

    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var label = data.datasets[tooltipItem.datasetIndex].label || '';
          labelsFiltro = data.labels[ tooltipItem.index];
          datasetsFiltro = data.datasets[tooltipItem.datasetIndex].label
          if (label) {
              label += ': ';
          }
          label += Math.round(tooltipItem.yLabel * 100) / 100;
          return label;
      }
      }
    },
    'onClick': function (evt, item) {

      console.log('labelsFiltro ', labelsFiltro);
      console.log('datasetsFiltro ', datasetsFiltro )

      if (item.length > 0) {
          showTable(grafico, labelsFiltro, datasetsFiltro)
      }
      }


      
  },
});
    function showTable(grafico_: string, labelsFiltro: string, datasetsFiltro: string ){

      let filtros: any = '';
      let idSql = 0;
      let titulo = '';
      dataInicial_ = dataInicial_.replace('/','').replace('/','');
      dataFinal_ = dataFinal_.replace('/','').replace('/','');
      
        if(grafico_ == "prospeccaoChart") { 
          idSql = 7;
          filtros= `and resposta_motivo = '${labelsFiltro}' and  login = '${datasetsFiltro}' `
          titulo = `Eventos de prospecções concluidos por ${datasetsFiltro} com resposta ${labelsFiltro}`;
        } else if(grafico_ == "propostaEmitidasChart") {
          idSql = 8;
          titulo = `Proposas emitidas com status ${labelsFiltro}`;
      }

      if (idSql>0) router_.navigate([`/showTable/{"idSql":${idSql},"filtros":"${filtros}","dataInicial":"${dataInicial_}","dataFinal":"${dataFinal_}" ,"titulo": "${titulo}"}`]);
    }
};

graficoPropostaEmitidas(tipoGrafico: string,  grafico: string, router_: Router, dataInicial_ = this.dataInicial, dataFinal_ = this.dataFinal){
  let router: Router;

  var ctx = document.getElementById(grafico);
  var labelsFiltro: any;
  var datasetsFiltro: any;

  this.myChartProposta = new Chart(ctx, {
    type: tipoGrafico ,
    data: {
      labels: this.labels,
      datasets: this.datasets,
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      responsive: true,
      legend: { 
        display: true 

    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var label = data.datasets[tooltipItem.datasetIndex].label || '';
          labelsFiltro = data.labels[ tooltipItem.index];
          datasetsFiltro = data.datasets[tooltipItem.datasetIndex].label
          if (label) {
              label += ': ';
          }
          label += Math.round(tooltipItem.yLabel * 100) / 100;
          return label;
      }
      }
    },
    'onClick': function (evt, item) {
      if (item.length > 0) {
          showTable(grafico, labelsFiltro, datasetsFiltro)
      }
      }
  },
});
    function showTable(grafico_: string, labelsFiltro: string, datasetsFiltro: string ){

      let filtros: any = '';
      let idSql = 0;
      let titulo = '';
      dataInicial_ = dataInicial_.replace('/','').replace('/','');
      dataFinal_ = dataFinal_.replace('/','').replace('/','');
      

      idSql = 8;
      titulo = `Proposas emitidas por ${datasetsFiltro} com status ${labelsFiltro}`;
      filtros= `and status_proposta = '${labelsFiltro}' and  login = '${datasetsFiltro}' `
   

      if (idSql>0) router_.navigate([`/showTable/{"idSql":${idSql},"filtros":"${filtros}","dataInicial":"${dataInicial_}","dataFinal":"${dataFinal_}" ,"titulo": "${titulo}"}`]);
    }
};
  

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



}
