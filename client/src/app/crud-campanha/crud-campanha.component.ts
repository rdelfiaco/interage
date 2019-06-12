import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent} from '../../lib/ng-uikit-pro-standard';
import { CrudCampanhaService } from './crud-campanha.service';
import { LocalStorage } from '../shared/services/localStorage';
import { Usuario } from '../login/usuario';
import { BancoDados } from '../shared/services/bancoDados';


@Component({
  selector: 'app-crud-campanha',
  templateUrl: './crud-campanha.component.html',
  styleUrls: ['./crud-campanha.component.scss']
})
export class CrudCampanhaComponent implements OnInit {

  @ViewChild('abasTabs') staticTabs: TabsetComponent;
  abaAtual: number;
  usuarioLogado: Usuario;
  canais: any;
  usuarios: any;
  motivos: any;
  questionarios: any;
  campanhas: any;
  campanhaUsuarios: any;
  sorted: boolean = false;

  

   constructor(  
                private service : CrudCampanhaService = new CrudCampanhaService, 
                private localStorage: LocalStorage,
                private bancoDados: BancoDados = new BancoDados


    ) {

      this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
      this.service.abaAtual = 1;


   }

  async ngOnInit() {

    // this.canais = await this.bancoDados.lerDados('getCanais', { } ) as any; 
    // this.canais =this.canais.resposta.filter( e => e.status ); // só selecionar os ativos 
    // this.motivos = await this.bancoDados.lerDados('getMotivos', {}) as any;
    // this.motivos =this.motivos.resposta.filter( e => e.status );
    // this.questionarios = await this.bancoDados.lerDados('getQuestionarios', {}) as any;
    // this.questionarios =this.questionarios.resposta.filter( e => e.status );
    this.campanhas = await this.bancoDados.lerDados('getCampanhas', {}) as any;
    this.campanhas = this.campanhas.resposta;


    this.staticTabs.setActiveTab( this.service.abaAtual )
    this.service.emitiAba.subscribe(
      abaA => { 
                this.staticTabs.setActiveTab(abaA);
                this.abaAtual = abaA}
    )
  }

  async usuariosCampanha(campanhaId ){
    this.service.campanhaSelecionadoAtual = this.campanhas.filter(t => t.id == campanhaId)[0];
    this.service.abaAtual = 2;
  }


  sortBy(by: string | any): void {
    // if (by == 'dt_criou') {
    //   this.search().reverse();
    // } else {
      this.campanhas.sort((a: any, b: any) => {
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
