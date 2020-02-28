import { map } from 'rxjs/operators';
import { element } from 'protractor';
import { Meses } from './../shared/services/meses';
import { Component, OnInit } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { ToastService } from '../../lib/ng-uikit-pro-standard';
import { Usuario } from '../login/usuario';
import * as moment from 'moment';
import { BancoDados } from '../shared/services/bancoDados';
import * as Chart from 'chart.js/dist/Chart';
import { RandomColor } from '../shared/services/randomColor';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  mesInical = Number( moment().format('MM') );

  usuarioLogado: any;
  usuarioLogadoSupervisor: boolean = true;

  carregando: boolean = true;


  propostas: Array<any>;
  qtdeMeses = 13; 
  meses = new Meses();
  meses_ = this.meses.UltimosMeses(this.qtdeMeses);

  chartBoletos: any;
  boletosRecebitosEmDia = [];
  boletosRecebitosForaDoDia = [];
  boletosRecebitosAposContato = [];
  boletosAbertos = []; 

  eventosAtendimentosData = []; 
  eventosAtendimentosLabes = [];
  _backgroundColor = [];
  _borderColor = [];

  async getBoletosSGA(){
  // abertos
    let dataPesquisa = moment().startOf('month');
    let i = 0; 
    while ( i < this.qtdeMeses )  {
      let dataInicial = moment(dataPesquisa).startOf('month').format('DD/MM/YYYY');
      let dataFinal =  moment(dataPesquisa).endOf('month').format('DD/MM/YYYY');
      let resp = await this.bancoDados.lerDados('getBoletos',
      { dataInicial:  dataInicial ,
        dataFinal: dataFinal,
        codigo_situacao: "2" // abertos;
      }) as any;
      if(!resp || resp.error) 
      {
        this.toastrService.error('Erro ao consultar boletos ');
        return;
      };
      
      dataPesquisa =  moment(dataPesquisa).subtract(1, 'months');

      this.boletosAbertos.push( resp.resposta.length )
      i++ ; 
    }
    
    // recebidos 
    dataPesquisa = moment().startOf('month');
    i = 0; 
    while  (i < this.qtdeMeses )  {
      let dataInicial = moment(dataPesquisa).startOf('month').format('DD/MM/YYYY');
      let dataFinal =  moment(dataPesquisa).endOf('month').format('DD/MM/YYYY');
      let resp = await this.bancoDados.lerDados('getBoletos',
      { dataInicial:  dataInicial ,
        dataFinal: dataFinal,
        codigo_situacao: "1" // recebidos;
      }) as any;
      if(!resp || resp.error) 
      {
        this.toastrService.error('Erro ao consultar boletos ');
        return;
      };
      dataPesquisa =  moment(dataPesquisa).subtract(1, 'months');
      let totalRecebitosEmDia = 0; 
      let totalRecebitosForaDoDia = 0; 
      let boletos = resp.resposta;
      

      boletos.forEach(element => {
          if (element.data_vencimento == element.data_pagamento || element.data_vencimento > element.data_pagamento ) {
            totalRecebitosEmDia++;
          }else{
            totalRecebitosForaDoDia++;
          }
      });
      this.boletosRecebitosEmDia.push( totalRecebitosEmDia );
      this.boletosRecebitosForaDoDia.push ( totalRecebitosForaDoDia ); 
      i++;  
    }

    // boletos Recebitos Após Contato


    let resp = await this.bancoDados.lerDados('getEventosBoletosPagos',{ }) as any;
    if(!resp || resp.error) 
    {
      this.toastrService.error('Erro ao consultar eventos dos boletos pagos ');
      return;
    };


    i = 0;
    this.boletosRecebitosAposContato = [];
    while  (i < this.qtdeMeses ){
      if (resp.resposta[i]) { 
        this.boletosRecebitosAposContato.push( resp.resposta[i].total);
      }else {
        this.boletosRecebitosAposContato.push( 0); 
      }
      i++;
    }
  }

  constructor(private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private toastrService: ToastService ,
    private bancoDados: BancoDados = new BancoDados,
    private randomColor: RandomColor,
    ) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.usuarioLogadoSupervisor = this.usuarioLogado.responsavel_membro == "R"; 
  }

  async ngOnInit() {

    this.carregando = false;

    await this.getBoletosSGA();
    this.graficoBoletos();

    await this.getEventosAtendimento();
    this.graficoEventosAtendimento();

    this.carregando = true;

  };

  graficoBoletos(){


    var ctx = document.getElementById('chartBoletos');
  
    this.chartBoletos = new Chart(ctx, {
      type: 'line' ,
      data: {
        labels: this.meses_.ultimosMesesAbreviados,
        datasets: [
          { data: this.boletosAbertos, 
            label: 'Abertos',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 2 },
          { data: this.boletosRecebitosEmDia, 
            label: 'Recebidos em dia' ,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            borderColor: 'rgba(0, 255, 0, 1)',
            borderWidth: 2 },
          { data: this.boletosRecebitosForaDoDia, 
            label: 'Recebidos após vencimento ' ,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            borderColor: 'rgba(0, 150, 255, 1)',
            borderWidth: 2 },
          { data: this.boletosRecebitosAposContato, 
            label: 'Recebidos após contato ' ,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            borderColor: 'rgba(255, 150, 0, 1)',
            borderWidth: 2 },
        ]
      },
      options: {
      }
    });
  }
    
  async getEventosAtendimento( ){
    let eventos  = await this.bancoDados.lerDados('getInformacaoAtendimentos',
    {
      idPessoaDosUsuarios: -1,
      dataInicial: moment().subtract(30, 'days').format('DD/MM/YYYY'),
      dataFinal: moment().format('DD/MM/YYYY')
    }) as any;
    if(!eventos || eventos.error) 
    {
    this.toastrService.error('Erro eventos de atendimentos ');
    return;
    };

    let tableData = eventos.resposta;
    this.eventosAtendimentosData =   tableData.map(elem => {
      return  elem.total
    })
    this.eventosAtendimentosLabes =   tableData.map(elem => {
      return  elem.motivo
    })






  }


  graficoEventosAtendimento(){

    this._backgroundColor = [];
    this._borderColor = []; 

    this.eventosAtendimentosData.forEach( element => {
      let rgb_rgba = this.randomColor.getRandomColorRGBeRGBA()
      this._backgroundColor.push(`${rgb_rgba.rgba}`);
      this._borderColor.push(`${rgb_rgba.rgb}`);
    });


    var ctx = document.getElementById('chartAtendimentoReceptivo');
    
      this.chartBoletos = new Chart(ctx, {
        type: 'doughnut' ,
        data: {
          labels: this.eventosAtendimentosLabes,
          datasets: [
            { data: this.eventosAtendimentosData, 
              // label: 'Abertos',
              backgroundColor: this._backgroundColor,
              borderColor: this._borderColor,
              // borderWidth: 2 
            },
          ]
        },
        options: {
        }
      });
  }



}
