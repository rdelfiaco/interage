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
  label: string ;
  data: Array<any> = [];
  backgroundColor: Array<any> = [];
  borderColor: Array<any> = [];

  constructor(
        private http: Http, 
        private connectHTTP: ConnectHTTP, 
        private localStorage: LocalStorage,
        private toastrService: ToastService, 
        private valida: Valida,
        private router: Router,
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
    this.label = '';
    this.data = [];
    this.backgroundColor = [];
    this.borderColor = [];

    this.prospeccao.forEach( (value: any, index: number, array: any[]) =>{
        
     this.labels.push( value.consultor);
     this.data.push( value.total);
     this.backgroundColor.push( `rgba(${value.color_r}, ${value.color_g}, ${value.color_b}, 0.2)`);
     this.borderColor.push(`rgba(${value.color_r}, ${value.color_g}, ${value.color_b}, 1)`);

     })

     this.graficoProspeccao('prospeccaoChart');


     // grafico das propostas emitidas 
     this.labels = [];
     this.label = '';
     this.data = [];
     this.backgroundColor = [];
     this.borderColor = [];
 
     this.propostaEmitidas.forEach( (value: any, index: number, array: any[]) =>{
         
      this.labels.push( value.consultor);
      this.data.push( value.total);
      this.backgroundColor.push( `rgba(${value.color_r}, ${value.color_g}, ${value.color_b}, 0.2)`);
      this.borderColor.push(`rgba(${value.color_r}, ${value.color_g}, ${value.color_b}, 1)`);
 
      })
 
      this.graficoProspeccao('propostaEmitidasChart');


      

  }


  graficoProspeccao(grafico: string){
  let router: Router;
  let ctx = document.getElementById(grafico);
  let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: this.labels,
      datasets: [{
        label: this.label,
        data: this.data,
        backgroundColor: this.backgroundColor,
        borderColor: this.borderColor,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      legend: { 
        display: false 
    },
      'onClick': function (evt, item) {
        var idRegistro = item[0]['_model'].label
        console.log(idRegistro)
        showTable(5,idRegistro, `Ligações de prospecções do(a) ${idRegistro}` )
        
      }

      
  },
});

    function showTable(idSql: number, idRegistro: any, titulo: any){
      router.navigate([`/showTable/{"idSql":${idSql},"idRegistro":${idRegistro},"titulo": "${titulo}"}`]);
      
    }

};
  

 

}
