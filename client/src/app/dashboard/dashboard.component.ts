import { Component, OnInit } from '@angular/core';
import { async } from 'rxjs/internal/scheduler/async';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { ToastService } from '../../lib/ng-uikit-pro-standard';
import { Usuario } from '../login/usuario';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  usuarioLogado: any;
  usuarioLogadoSupervisor: boolean = false;

  propostas: Array<any>;

  public chartType: string = 'bar';

  public chartDatasets: Array<any> = [
    { data: [165, 159, 180, 181, 156, 155, 140], label: 'Todos' },
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Eventos' }
  ];

  public chartLabels: Array<any> = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }


  public chartTypeI: string = 'horizontalBar';

  public chartDatasetsI: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' }
  ];

  public chartLabelsI: Array<any> = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

  public chartColorsI: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
    }
  ];

  public chartOptionsI: any = {
    responsive: true
  };
  public chartClickedI(e: any): void { }
  public chartHoveredI(e: any): void { }
 


  public chartTypeIA: string = 'line';

  public chartDatasetsIA: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'My Second dataset' }
  ];

  public chartLabelsIA: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

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

  public chartTypeIB: string = 'pie';

  public chartDatasetsIB: Array<any> = [
    { data: [300, 50, 100, 40], label: 'Status das propostas' }
  ];

  public chartLabelsIB: Array<any> = ['Ativas', 'Em negociação', 'Recusadas', 'Canceladas'];

  public chartColorsIB: Array<any> = [
    {
      backgroundColor: ['#FDB45C', '#46BFBD', '#F7464A', '#949FB1'],
      hoverBackgroundColor: ['#FFC870', '#5AD3D1', '#FF5A5E', '#A8B3C5'],
      borderWidth: 2,
    }
  ];

  public chartOptionsIB: any = {
    responsive: true
  };
  public chartClickedIB(e: any): void { 

    console.log('status', e)
  }
  public chartHoveredIB(e: any): void {
    
    console.log('Hoveerded', e)

   }


  constructor(private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private toastrService: ToastService ) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.usuarioLogadoSupervisor = this.usuarioLogado.responsavel_membro == "R"; 
  }

  async ngOnInit() {

    
      let propostas = await this.connectHTTP.callService({
        service: 'getPropostasPorStatusSintetico',
        paramsService: {
          idUsuarioLogado: this.usuarioLogado.id,
          // dataInicial: this.dataInicial,
          // dataFinal: this.dataFinal
        }
      }) as any;
  
  
    };

  




}
