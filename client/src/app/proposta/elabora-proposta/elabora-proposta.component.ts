
import { Proposta } from '../proposta';
import { Component, OnInit, Input, EventEmitter, OnChanges, SimpleChanges, Type } from '@angular/core';
import { Usuario } from '../../login/usuario';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { Observable } from 'rxjs';

import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { ComunicaPropostaService } from '../comunica-proposta.service';

interface selectValues {
  value: string
  label: string
}

@Component({
  selector: 'app-elabora-proposta',
  templateUrl: './elabora-proposta.component.html',
  styleUrls: ['./elabora-proposta.component.scss']
})
export class ElaboraPropostaComponent implements OnInit {

  // @Input() refreshtabelaFipe: TabelaFipe;

  usuarioLogado: Usuario;
  tipoVeiculoSelect: Array<any>;
  tipoVeiculoSelectValue: number;

  rastreador: Array<any>;
  rastreadores: Array<any>;
  protecoesVidros: Array<any>;
  protecaoVidro: Array<any>;
  fundosTerceiros: Array<any>;
  fundoTerceiro: Array<any>;
  app: Array<any>;  
  apps: Array<any>;
  carrosReservas: Array<any>;
  carroReserva: Array<any>;
  tabelaValores: Array<any>;
  tabelaCombos: Array<any>;
  combos: Array<any>;
  valores: Array<any>;
  vlrPoposta: number;
  valorPPV: number;
  cota: number;
  adesao: number;
  vlrParticipacao: number;
  prcParticipacao: number;
 

  sVlrVeiculo: string;
  nVlrVeiculo: number;

  proposta: Proposta;

// radios 
  chkPrecos: string = "2";
  chkFundo: string = "1";
  chckCarroRes: string = "1";
  chckProtecaoVidro: string = "0";
  chckApp: string = "1";
  chckRastreador: string = "0";
// 


  constructor( private connectHTTP: ConnectHTTP, 
    private localStorage: LocalStorage,
    private propostaComuc: ComunicaPropostaService,
    private aba: ComunicaPropostaService,
    private toastrService: ToastService  ){
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
  }


 async ngOnInit() {


    let tabelaPrecos = await this.connectHTTP.callService({
      service: 'getTabelaPrecos',
      paramsService: {
        token: this.usuarioLogado.token,
        id_usuario: this.usuarioLogado.id,        
        id_organograma: this.usuarioLogado.id_organograma
      }
    }) as any;

    console.log(' carrega tabelas de preços')
    this.rastreadores = tabelaPrecos.resposta.Rastreador;  
    this.protecoesVidros = tabelaPrecos.resposta.ProtecaoVidros;
    this.fundosTerceiros = tabelaPrecos.resposta.FundoTerceiro; 
    this.apps = tabelaPrecos.resposta.App;
    this.carrosReservas = tabelaPrecos.resposta.CarroReserva;
    this.tabelaValores = tabelaPrecos.resposta.TabelaValores;
    this.tabelaCombos = tabelaPrecos.resposta.TabelaCombos;

    // combo tipo do veículo 
    this.tipoVeiculoSelect = tabelaPrecos.resposta.TipoVeiculos;
    this.tipoVeiculoSelect = this.tipoVeiculoSelect.map(tipoVeiculo => {
      return { value: tipoVeiculo.id, label: tipoVeiculo.nome }
    });

    this.tipoVeiculoSelectValue = 1;
    
    this.propostaComuc.emitiProposta.subscribe(
      proposta => this.atualizaValorVeiculo(proposta)
    );
  }

  atualizaValorVeiculo(proposta_: Proposta){
    this.sVlrVeiculo = proposta_.precoMedio;
    this.atualizaTabelas();
  }

  atualizaTipoVeiculo(){
    if (this.tipoVeiculoSelectValue < 3){
      this.chkPrecos = "2";
    }else {
      this.chkPrecos = "6";
    }
    
    this.atualizaTabelas()

  }


  atualizaTabelas(){
    
    this.nVlrVeiculo =  Number(this.sVlrVeiculo.substr(2,12).trim().replace('.','').replace(',','.'));

    this.combos = this.tabelaCombos.filter( this.filtraTabelas, [this.nVlrVeiculo, this.tipoVeiculoSelectValue ]);

    this.valores = this.tabelaValores.filter( this.filtraTabelas, [this.nVlrVeiculo, this.tipoVeiculoSelectValue ]);

    this.fundoTerceiro = this.fundosTerceiros.filter( this.filtraTabelasTipoVeiculos , [this.tipoVeiculoSelectValue ]);

    this.carroReserva = this.carrosReservas.filter( this.filtraTabelasTipoVeiculos , [this.tipoVeiculoSelectValue ]);

    this.protecaoVidro = this.protecoesVidros.filter( this.filtraTabelasTipoVeiculos , [this.tipoVeiculoSelectValue ]);

    this.rastreador = this.rastreadores.filter( this.filtraTabelasTipoVeiculos , [this.tipoVeiculoSelectValue ]);

    this.app = this.apps.filter( this.filtraTabelasTipoVeiculos , [this.tipoVeiculoSelectValue ]);

    if (this.valores ) 
      {
        this.valorPPV = this.valores[0].valor_ppv;
        this.cota = this.valores[0].cota;
        this.adesao = this.valores[0].adesao
        // para participação P Percentual se faz o calculo caso contralio o valor é fixo 
        if (this.valores[0].tipo_participacao == 'P') {
          this.vlrParticipacao = this.valores[0].valor_participacao * this.nVlrVeiculo / 100
          this.prcParticipacao = this.valores[0].valor_participacao
        } else {
          this.vlrParticipacao = this.valores[0].valor_participacao
          this.prcParticipacao = 0 
        }

        this.somaValoresProposta();
      }else {
        this.toastrService.error('Tabela correspondente não encontrada')
      }
  }




  filtraTabelas(element: any, index: any, array: any){
    
    if (( this[0] >= element.valor_inicial && this[0] <= element.valor_final ) 
          && (this[1] == element.id_tipo_veiculo ) ) {
        return element
    }
      else {
        return false
      }
  }

  // filtra considerando somente o tipo do veiculo
  filtraTabelasTipoVeiculos(element: any, index: any, array: any){
    if (this[0] == element.id_tipo_veiculo )  {
        return element
    }
      else {
        return false
      }
  }

  somaValoresProposta(){
    
    if (this.chkPrecos != "6" ){
      this.vlrPoposta = this.combos[this.chkPrecos].valor_combo;
    } else{
      this.vlrPoposta = Number(this.valorPPV);
      if ( this.fundoTerceiro.length > 0){
        this.vlrPoposta = this.vlrPoposta + Number(this.fundoTerceiro[this.chkFundo].valor )};
      if (this.carroReserva.length > 0){
        this.vlrPoposta = this.vlrPoposta + Number(this.carroReserva[this.chckCarroRes].valor)};
      if (this.protecaoVidro.length > 0) {
        this.vlrPoposta = this.vlrPoposta + Number(this.protecaoVidro[this.chckProtecaoVidro].valor)};
      if (this.app.length){
        this.vlrPoposta = this.vlrPoposta + Number(this.app[this.chckApp].valor)};
      if (this.rastreador.length > 0){
        this.vlrPoposta = this.vlrPoposta + Number( this.rastreador[this.chckRastreador].valor)};
    }
  }

  mudouPlano(opcao){
    this.chkPrecos = opcao;
    this.somaValoresProposta()
  }

  mudouFundo(opcao){
    this.chkFundo = opcao;
    this.somaValoresProposta()
  }

  mudouCarroReserva(opcao){
    this.chckCarroRes = opcao;
    this.somaValoresProposta()
  }

  mudouProtecaoVidro(opcao){
    this.chckProtecaoVidro = opcao;
    this.somaValoresProposta()
  }

  mudouApp(opcao){
    this.chckApp = opcao;
    this.somaValoresProposta()
  }
  mudouRastreador(opcao){
    this.chckRastreador = opcao;
    this.somaValoresProposta()
  }

}