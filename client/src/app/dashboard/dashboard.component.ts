import { Meses } from './../shared/services/meses';
import { Component, OnInit } from '@angular/core';
import { async } from 'rxjs/internal/scheduler/async';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { ToastService } from '../../lib/ng-uikit-pro-standard';
import { Usuario } from '../login/usuario';
import * as moment from 'moment';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  mesInical = Number( moment().format('MM') );

  usuarioLogado: any;
  usuarioLogadoSupervisor: boolean = false;

  propostas: Array<any>;

  meses = new Meses();
  


  public chartTypeIA: string = 'line';

  public chartDatasetsIA: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40, 30, 20, 10, 15, 5, 65 ], label: 'My First dataset' },
    { data: [28, 48, 40, 19, 86, 27, 90, 5, 15, 30, 10, 20, 28 ], label: 'My Second dataset' }
  ];

  public chartLabelsIA: Array<any> = this.meses.UltimosMeses(13).ultimosMesesAbreviados ;

  public chartColorsIA: Array<any> = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    }
  ];

  public chartOptionsIA: any = {
    responsive: true
  };
  public chartClickedIA(e: any): void { }
  public chartHoveredIA(e: any): void { }


  constructor(private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private toastrService: ToastService ) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.usuarioLogadoSupervisor = this.usuarioLogado.responsavel_membro == "R"; 

    this.getBoletosSGA();



  }

  async ngOnInit() {

    console.log( 'chartLabelsIA', this.chartLabelsIA  )
    console.log( 'meses ', this.meses.UltimosMeses(13 ) )
    
  
    };

  

    getBoletosSGA(){

      

    }


}
