import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { IMyOptions, ToastService } from '../../lib/ng-uikit-pro-standard';
import { Http } from '@angular/http';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { Valida } from '../shared/services/valida';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';



@Component({
  selector: 'app-ranks',
  templateUrl: './ranks.component.html',
  styleUrls: ['./ranks.component.scss']
})
export class RanksComponent implements OnInit {

  usuarioLogado: any;
  prospeccao: Array<any> = []; // total de eventos com  motivo prospecção de cada usuario 
  propostaEmitidas: Array<any> = [];
  

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

    this.montaGraficos();
    
  };


  montaGraficos(){

    // grafico prospecções
    this.labels = [];
    this.label = [];
    this.datasets = [];


    this.prospeccao.forEach( (value: any, index: number, array: any[]) =>{
        
        if (this.labels.indexOf(value.resposta_motivo)==-1) this.labels.push( value.resposta_motivo);
        
        if (this.label.indexOf(value.consultor)==-1 ) this.label.push( value.consultor);
        
    });
    debugger
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
            // let i = label_.indexOf(value.consultor)
            // this.data = [];
            // this.backgroundColor = [];
            // this.borderColor = [];

            // prospeccao_.forEach( (value: any, index: number, array: any[]) =>{

            //   if (label_[i] = value.consultor) {
            //     this.data.push( value.total),
            //     this.backgroundColor.push( `rgba(${value.color_r}, ${value.color_g}, ${value.color_b}, 0.2)`),
            //     this.borderColor.push(`rgba(${value.color_r}, ${value.color_g}, ${value.color_b}, 1)`)
            //   }
            // });

            // this.datasets.push({

            //   label: value.consultor,
            //   data: this.data,
            //   backgroundColor: this.backgroundColor,
            //   borderColor: this.borderColor,
            //   borderWidth: 1

            // });
        
     
  

     console.log(this.labels)
     console.log('label', this.label)
     console.log(this.datasets)



     this.graficoProspeccao('bar','prospeccaoChart', this.router);


    //  // grafico das propostas emitidas 
    //  this.labels = [];
    //  this.label = [];
    //  this.data = [];
    //  this.backgroundColor = [];
    //  this.borderColor = [];
 
    //  this.propostaEmitidas.forEach( (value: any, index: number, array: any[]) =>{
         
    //   this.labels.push( value.consultor);
    //   this.data.push( value.total);
    //   this.backgroundColor.push( `rgba(${value.color_r}, ${value.color_g}, ${value.color_b}, 0.2)`);
    //   this.borderColor.push(`rgba(${value.color_r}, ${value.color_g}, ${value.color_b}, 1)`);
 
    //   })
 
    //   this.graficoProspeccao('propostaEmitidasChart');

    // grafico das propostas emitidas 
    this.labels = [];
    this.label = [];
    this.datasets = [];


    this.propostaEmitidas.forEach( (value: any, index: number, array: any[]) =>{
        
        if (this.labels.indexOf(value.status_proposta)==-1) this.labels.push( value.status_proposta);
        
        if (this.label.indexOf(value.consultor)==-1 ) this.label.push( value.consultor);
        
    });
    debugger
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

    }

    this.graficoProspeccao( 'horizontalBar', 'propostaEmitidasChart', this.router);


      

  }


  graficoProspeccao(tipoGrafico: string,  grafico: string, router_: Router, dataInicial_ = this.dataInicial, dataFinal_ = this.dataFinal){
  let router: Router;
  let ctx = document.getElementById(grafico);
  let myChart = new Chart(ctx, {
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
      'onClick': function (evt, item) {
        console.log(item)

        var activePoints = myChart.getElementsAtEvent(evt);
        console.log(activePoints);

        if (item.length > 0) {
           showTable(grafico, item[0]._model.label)
        }
        },


      
  },
});

    function showTable(grafico_: string, label_: string){

      debugger
      let idRegistro = label_;
      let idSql = 0;
      let titulo = '';
      let filtro = 'where '
      dataInicial_ = dataInicial_.replace('/','').replace('/','');
      dataFinal_ = dataFinal_.replace('/','').replace('/','');
      
        if(grafico_ == "prospeccaoChart") { 
          idSql = 7;
          titulo = `Eventos de prospecções concluidos com resposta ${label_}`;
        } else if(grafico_ == "propostaEmitidasChart") {
          idSql = 8;
          titulo = `Proposas emitidas com status ${label_}`;
      }

      if (idSql>0) router_.navigate([`/showTable/{"idSql":${idSql},"idRegistro":"${idRegistro}","dataInicial":"${dataInicial_}","dataFinal":"${dataFinal_}" ,"titulo": "${titulo}"}`]);
    }

};
  

 

}
