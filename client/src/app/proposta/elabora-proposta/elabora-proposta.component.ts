import { ModalModule } from './../../../lib/ng-uikit-pro-standard/free/modals/modal.module';
import { ModalDirective } from './../../../lib/ng-uikit-pro-standard/free/modals/modal.directive';
import { style } from '@angular/animations';

import { Proposta } from '../proposta';
import { Component, OnInit, Input, EventEmitter, OnChanges, SimpleChanges, Type, Output } from '@angular/core';
import { Usuario } from '../../login/usuario';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { Observable } from 'rxjs';

import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { ComunicaPropostaService } from '../comunica-proposta.service';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { img } from '../imagem';

import * as numeral from 'numeral';
import 'numeral/locales';

numeral.locale('pt-br');
numeral(10000).format('0,0') // 10.000

import * as moment from 'moment';
import { timestamp } from 'rxjs/operators';


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
  pessoaObject: any;
  @Input()
  set pessoa(pessoa: any) {
    
    this.pessoaObject = pessoa;
    // this.initValueId = new Observable((observer) => {
    //    if(pessoa) observer.next(pessoa.principal.id);
    // });
    if(pessoa){
      this.initValueId =  pessoa.principal.id;
      this.idPessoaCliente = pessoa.principal.id;
      this.Cliente = pessoa.principal.nome;
    }
  }
  get pessoa() {
    return this.pessoaObject;
  }
  @Input() evento: any
  @Input() returnProp: boolean;
  @Output() returnProposta = new EventEmitter();

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
  valores: Array<any> = [];
  vlrProposta: number = 0 ;
  valorPPV: number;
  cota: number;
  adesao_: any;
  adesao: number;
  vlrParticipacao: number;
  vlrParticipacao_: any;
  prcParticipacao: number;
  bntGeraProposta: boolean = true;
  sccMoto: number = 0;
  moto:boolean = false;
  hoje: string = moment().format('DD/MM/YYYY')
  cotaAlterada: boolean = false;
  parcelasAdesao: number = 1;
  parcelasRastreador: number = 1;
  adesaoParcelada: number; // valor da parcela da adesão 
  adesaoParcelada_: any;
  mensalidadeSemParcelamento: number;
  mensalidadeSemParcelamento_: any;
  mensalidadeComParcelamento_: any; //  this.proposta.mensalidade 
  entrada:number = 0.00; 
  entrada_:any; // this.proposta.entrada
  rastreadorInstalacao: number = 0.00;
  fundoTerceiroOutros: string = '';
  carroReservaOutros: string = '';
  protecaoVidroOutros: string = '';
  appOutros: string = '';
  rastreadorOutros: string = '';

  sVlrVeiculo: string;
  nVlrVeiculo: number;

  proposta: Proposta;

  // initValueId: Observable<any>;
  initValueId: number;
  idPessoaCliente: string;
  Cliente: string;

  // radios 
  chkPrecos: string = "6";
  chkFundo: string = "1";
  chckCarroRes: string = "1";
  chckProtecaoVidro: string = "1";
  chckApp: string = "1";
  chckRastreador: string = "0";
  chckPortabilidade: boolean = false;
  chckNovo: boolean = true;
  chckParticular: boolean = true;
  chckComercial: boolean = false;
  chckNormal: boolean = true;
  chckLeilaoSinistrado: boolean = false;
  // 


  constructor(private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private propostaComuc: ComunicaPropostaService,
    private aba: ComunicaPropostaService,
    private toastrService: ToastService) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  async ngOnInit() {
    let tabelaPrecos = await this.connectHTTP.callService({
      service: 'getTabelaPrecos',
      paramsService: {
        id_organograma: this.usuarioLogado.id_organograma
      }
    }) as any;
    this.rastreadores = tabelaPrecos.resposta.Rastreador;
    this.protecoesVidros = tabelaPrecos.resposta.ProtecaoVidros;
    this.fundosTerceiros = tabelaPrecos.resposta.FundoTerceiros;
    this.apps = tabelaPrecos.resposta.App;
    this.carrosReservas = tabelaPrecos.resposta.CarroReserva;
    this.tabelaValores = tabelaPrecos.resposta.TabelaValores;
    this.tabelaCombos = tabelaPrecos.resposta.TabelaCombos;
    this.bntGeraProposta = false;
    
    // this.initValueId = new Observable((observer) => {
    //   observer.next('');
    // });
    debugger;

    // combo tipo do veículo 
    this.tipoVeiculoSelect = tabelaPrecos.resposta.TipoVeiculos;
    this.tipoVeiculoSelect = this.tipoVeiculoSelect.map(tipoVeiculo => {
      return { value: tipoVeiculo.id, 
               label: tipoVeiculo.nome, 
               reboque: tipoVeiculo.reboque, 
               id_tipo_veiculo: tipoVeiculo.id,
               moto: tipoVeiculo.moto }
    });

    this.tipoVeiculoSelectValue = 1;

    this.propostaComuc.emitiProposta.subscribe(
      proposta => {
        this.proposta = proposta;
        if (proposta.codigoFipe === undefined || proposta.codigoFipe === null) {
          this.valores = [];
          this.sVlrVeiculo = ''
        } else {
          this.atualizaValorVeiculo(proposta)
        }
      }
    );

    this.chckPortabilidade = false;
    this.chckNovo = false;
    this.chckParticular = false;
    this.chckComercial = false;
    this.chckNormal = false;
    this.chckLeilaoSinistrado = false;
    this.bntGeraProposta = true;
  }

  atualizaValorVeiculo(proposta_: Proposta) {
    this.sVlrVeiculo = proposta_.precoMedio;
    this.atualizaTabelas();
  }

  atualizaTipoVeiculo() {
    let TabelasTipoVeiculosDados = this.tipoVeiculoSelect.filter(this.filtraTabelasTipoVeiculos, [this.tipoVeiculoSelectValue]);
    this.moto = TabelasTipoVeiculosDados[0].moto;
    this.atualizaTabelas()
  }


  atualizaTabelas() {


    let nVlrBusca = 0;

    if (!this.moto){
      this.nVlrVeiculo = Number(this.sVlrVeiculo.substr(2, 12).trim().replace('.', '').replace(',', '.'));
      nVlrBusca = this.nVlrVeiculo;
    }else{
      nVlrBusca = this.sccMoto;
      this.chckApp = "0";
    }


    if (this.tabelaCombos.length > 0) {
      this.combos = this.tabelaCombos.filter(this.filtraTabelas, [nVlrBusca, this.tipoVeiculoSelectValue]);
    }

    this.filtraTabelasCota(nVlrBusca) // busca tabela de valores 
    
    this.fundoTerceiro = this.fundosTerceiros.filter(this.filtraTabelasTipoVeiculos, [this.tipoVeiculoSelectValue]);

    this.carroReserva = this.carrosReservas.filter(this.filtraTabelasTipoVeiculos, [this.tipoVeiculoSelectValue]);

    this.protecaoVidro = this.protecoesVidros.filter(this.filtraTabelasTipoVeiculos, [this.tipoVeiculoSelectValue]);

    this.rastreador = this.rastreadores.filter(this.filtraTabelas, [nVlrBusca, this.tipoVeiculoSelectValue]);

    this.app = this.apps.filter(this.filtraTabelasTipoVeiculos, [this.tipoVeiculoSelectValue]);
    
    if (this.valores.length > 0 ) {
      this.valorPPV = this.valores[0].valor_ppv;
      this.cota = this.valores[0].cota;
      

      // Novo ou partabilidade 
      if (this.chckNovo) {
        this.adesao = Number(this.valores[0].adesao)
      }else
      {
          this.adesao = Number(this.valores[0].adesao_maxima);
      }

      // para carro comercial a participação é maior que carro particular 
      if (this.chckParticular) {
        this.vlrParticipacao = Number(this.valores[0].valor_participacao_particular);
      } else {
        this.vlrParticipacao = Number(this.valores[0].valor_participacao_comercial);
      }

      // 
      // para participação P Percentual se faz o calculo caso contralio o valor é fixo 
      if (this.valores[0].tipo_participacao == 'P') {
        this.prcParticipacao = this.vlrParticipacao;
        this.vlrParticipacao =  this.vlrParticipacao * this.nVlrVeiculo / 100;
        this.vlrParticipacao_ =  numeral(this.vlrParticipacao).format('0,000.00');
      } else {
        this.vlrParticipacao_ =  numeral(this.vlrParticipacao).format('0,000.00');
        this.prcParticipacao = 0;
      }



      // quando for combro ajustar 
      this.proposta.adesao = this.adesao;
      this.proposta.participacao = this.vlrParticipacao;

      this.somaValoresProposta();


    } else {
      
      this.toastrService.error('Tabela correspondente não encontrada')
      
    }
  }
  filtraTabelasCota(valorDeBusca: any) {
    for ( var i = 0; i <= this.tabelaValores.length -1 ; i++ ) {
        if ((valorDeBusca >= this.tabelaValores[i].valor_inicial) && (valorDeBusca <= this.tabelaValores[i].valor_final)
             && (this.tipoVeiculoSelectValue == this.tabelaValores[i].id_tipo_veiculo)) {
               if ((this.cotaAlterada) && (i > 1) 
                  && (this.tipoVeiculoSelectValue == this.tabelaValores[i-1].id_tipo_veiculo) ){
                this.valores[0]=  this.tabelaValores[i-1];
                return;
               }else{
                 this.valores[0]= this.tabelaValores[i] ;
                 return;
               }
             }
    }
     this.valores = [];
     return;
  }



  filtraTabelas(element: any, index: any, array: any) {

    if ((this[0] >= parseFloat(element.valor_inicial) && this[0] <= parseFloat(element.valor_final))
      && (this[1] == element.id_tipo_veiculo)) {
      return element
    }
    return false
  }

  // filtra considerando somente o tipo do veiculo
  filtraTabelasTipoVeiculos(element: any, index: any, array: any) {
    if (this[0] == element.id_tipo_veiculo) {
      return element
    }
    else {
      return false
    }
  }

  somaValoresProposta() {
    this.fundoTerceiroOutros = '';
    this.carroReservaOutros = '';
    this.protecaoVidroOutros = '';
    this.appOutros = '';
    this.rastreadorOutros = '';

    this.rastreadorInstalacao = 0;
    if (this.chkPrecos != "6") {
      if (this.tabelaCombos.length > 0) this.vlrProposta = this.combos[this.chkPrecos].valor_combo;
    } else {
      this.vlrProposta = Number(this.valorPPV);
      if (this.fundoTerceiro.length > 0) {
        this.vlrProposta = this.vlrProposta + Number(this.fundoTerceiro[this.chkFundo].valor);
        this.proposta.terceiros = this.fundoTerceiro[this.chkFundo].nome;
        this.fundoTerceiroOutros = this.fundoTerceiro[this.chkFundo].outros;
        this.proposta.idFundoTerceiros = this.fundoTerceiro[this.chkFundo].id;
      };
      if (this.carroReserva.length > 0) {
        this.vlrProposta = this.vlrProposta + Number(this.carroReserva[this.chckCarroRes].valor)
        this.proposta.idCarroReserva = this.carroReserva[this.chckCarroRes].id;
        this.proposta.carroReserva = this.carroReserva[this.chckCarroRes].nome;
        this.carroReservaOutros = this.carroReserva[this.chckCarroRes].outros;
      };
      if (this.protecaoVidro.length > 0) {
        this.vlrProposta = this.vlrProposta + Number(this.protecaoVidro[this.chckProtecaoVidro].valor)
        this.proposta.idProtecaoVidros = this.protecaoVidro[this.chckProtecaoVidro].id;
        this.proposta.protecaoVidros = this.protecaoVidro[this.chckProtecaoVidro].nome;
        this.protecaoVidroOutros = this.protecaoVidro[this.chckProtecaoVidro].outros;
      };
      if (this.app.length) {
        this.vlrProposta = this.vlrProposta + Number(this.app[this.chckApp].valor)
        this.proposta.idApp = this.app[this.chckApp].id;
        this.proposta.app =  this.app[this.chckApp].nome;
        this.proposta.appDescricao = this.app[this.chckApp].descricao;
        this.appOutros = this.app[this.chckApp].outros;
      };
      if (this.rastreador.length > 0) {
        this.vlrProposta = this.vlrProposta + Number(this.rastreador[this.chckRastreador].valor);
        this.proposta.idRastreador = this.rastreador[this.chckRastreador].id;
        this.proposta.rastreador = this.rastreador[this.chckRastreador].nome; 
        this.rastreadorInstalacao = Number(this.rastreador[this.chckRastreador].valor_instalacao);
        this.rastreadorOutros = this.rastreador[this.chckRastreador].outros
        if (this.parcelasRastreador > 1 ){
          this.rastreadorInstalacao = ( this.rastreadorInstalacao / this.parcelasRastreador) ;
        }

      };
    }
    
    let TabelasTipoVeiculosDados = this.tipoVeiculoSelect.filter(this.filtraTabelasTipoVeiculos, [this.tipoVeiculoSelectValue]);
    this.proposta.reboque = TabelasTipoVeiculosDados[0].reboque;
    this.moto = TabelasTipoVeiculosDados[0].moto;
    this.mensalidadeSemParcelamento = this.vlrProposta;
    this.proposta.mensalidadeAlterada = false;
    this.calculaValores();
  }

  calculaValores(){
    this.proposta.mensalidade = this.mensalidadeSemParcelamento;
    this.adesaoParcelada =this.adesao / this.parcelasAdesao;
    this.entrada = this.rastreadorInstalacao + this.adesao ;
    if (this.parcelasAdesao > 1 ){ 
      this.proposta.mensalidade = this.proposta.mensalidade  + this.adesaoParcelada;
      this.entrada = this.rastreadorInstalacao + this.proposta.mensalidade;
    }

    this.proposta.entrada = this.entrada;
    this.proposta.rastreadorInstalacao =  this.rastreadorInstalacao;
    this.proposta.parcelasRastreador = this.parcelasRastreador;

    // formatação valores em Real 
    this.adesao_  = numeral(this.adesao).format('00.00');
    this.mensalidadeSemParcelamento_ = numeral(this.mensalidadeSemParcelamento).format('00.00');
    this.entrada_ = numeral(this.entrada).format('00.00');
    this.adesaoParcelada_ = numeral(this.adesaoParcelada).format('00.00');
    this.mensalidadeComParcelamento_ = numeral(this.proposta.mensalidade).format('00.00');

  }

  mudouMensalidade(){
    this.proposta.mensalidadeAlterada = false;
    this.mensalidadeSemParcelamento = Number(this.mensalidadeSemParcelamento_.replace(',','.')) ; 
    if (this.mensalidadeSemParcelamento < this.vlrProposta){
      this.toastrService.error(`A mensalidade não pode ser menor que R$ ${ numeral(this.vlrProposta).format('00.00')}`);
      this.mensalidadeSemParcelamento = this.vlrProposta;
    }
    if (this.mensalidadeSemParcelamento != this.vlrProposta){ 
      this.proposta.mensalidadeAlterada = true;
     }
    this.calculaValores();
    }

  mudouNovoPortabilidade(){
    if (this.chckNovo) {
        this.chckPortabilidade = true;
        this.chckNovo = false;
    }else
    {
        this.chckPortabilidade = false; 
        this.chckNovo = true;
    }
    this.atualizaTabelas();
    this.habilitaBntGeraProposta();
  }

  mudouParcelasAdesao(){
    if (this.parcelasAdesao > 12){
      this.toastrService.error(`A quantidade de parcelas não pode ser maior que 12`);
      this.parcelasAdesao = 12;
    }
    this.adesaoParcelada = numeral( this.adesao / this.parcelasAdesao).format('0.00');
    this.somaValoresProposta();
  }

  mudouParcelasRastreador(){
    if (this.parcelasRastreador > 3 ){
      this.toastrService.error('A quantidade de parcelas não pode ser maior que 3 ');
      this.parcelasRastreador = 3;
    }
    this.somaValoresProposta();
  }

  mudouParticularComercial(){
    if (this.chckParticular){
      this.chckParticular = false;
      this.chckComercial = true;
    }else{
      this.chckParticular = true;
      this.chckComercial = false;
    }
    this.atualizaTabelas();
    this.habilitaBntGeraProposta();
  }

  mudouLeilaoSinistrado(){
    if (this.chckNormal){
      this.chckNormal = false;
      this.chckLeilaoSinistrado = true;
    }else {
      this.chckNormal = true;
      this.chckLeilaoSinistrado = false;
    }
    this.atualizaTabelas();
    this.habilitaBntGeraProposta();
  }

  cotaAnterior(){
    this.cotaAlterada = true;
    this.atualizaTabelas()
  }
  cotaPosterior(){
    this.cotaAlterada = false; 
    this.atualizaTabelas()
  }

  mudouPlano(opcao) {
    this.chkPrecos = opcao;
    this.somaValoresProposta()
  }

  mudouFundo(opcao) {
    this.chkFundo = opcao;
    this.somaValoresProposta()
  }

  mudouCarroReserva(opcao) {
    this.chckCarroRes = opcao;
    this.somaValoresProposta()
  }

  mudouProtecaoVidro(opcao) {
    this.chckProtecaoVidro = opcao;
    this.somaValoresProposta()
  }

  mudouApp(opcao) {
    this.chckApp = opcao;
    this.somaValoresProposta()
  }
  mudouRastreador(opcao) {
    this.chckRastreador = opcao;
    this.somaValoresProposta()
  }

  onSelectCliente(valor) {
    this.idPessoaCliente = valor.value;
    this.Cliente = valor.label;
  }

  validaAdesao(){
    this.adesao = Number(this.adesao_.replace(',','.'));
    if (this.adesao > Number(this.valores[0].adesao_maxima) ){
        this.toastrService.error(`Adesão não pode ser maior que ${Number(this.valores[0].adesao_maxima)}`);
        this.adesao =  Number(this.valores[0].adesao_maxima);
    }
    if ((this.adesao < Number(this.valores[0].adesao_minima) ) && (this.chckNovo)) {
      this.toastrService.error(`Adesão não pode ser menor que ${Number(this.valores[0].adesao_minima)}`);
      this.adesao =  Number(this.valores[0].adesao_minima);
  }
    this.proposta.adesao = this.adesao;
    this.somaValoresProposta();
  }


  geraProposta() {

    let reboqueIlimitado = 'Reboque ilimitado em caso de colisão, uma vez a cada 12 meses;'
    // se for undefined coloca vazio
    this.proposta.carroReserva = this.proposta.carroReserva ? this.proposta.carroReserva : '';
    this.proposta.protecaoVidros = this.proposta.protecaoVidros ? this.proposta.protecaoVidros : '';
    this.proposta.terceiros = this.proposta.terceiros ? this.proposta.terceiros : '';
    this.proposta.appDescricao = this.proposta.appDescricao ? this.proposta.appDescricao : '';
    this.proposta.rastreador = this.proposta.rastreador ? this.proposta.rastreador : '';
    this.proposta.reboque = this.proposta.reboque ? this.proposta.reboque : '';
    this.rastreadorOutros = this.rastreadorOutros ? this.rastreadorOutros : '';
    // moto
    if (this.moto) {
      this.proposta.carroReserva = '';
      this.proposta.protecaoVidros =  '';
      this.proposta.rastreador = '';
      reboqueIlimitado = '';
    }

    let parcelamentoRastreador = '';
    if (this.parcelasRastreador > 1){
      parcelamentoRastreador = `mais ${this.parcelasRastreador - 1} de ${numeral(this.rastreadorInstalacao).format('00.00') } da instalação do rastreador`
    }
    let normalLeilaoSisnsitro = 'Indenização 100% tabela Fipe, exceto veículos de leilão é remarcado';
    if (this.chckLeilaoSinistrado) {
      normalLeilaoSisnsitro = 'Indenização 80% tabela Fipe'
    }

    if (!this.idPessoaCliente) {
      this.toastrService.error('Selecione um cliente');
    } else {

      var docDefinition = {
        pageSize: 'A4',
        pageMargins: [10, 10, 5, 5],
        content: [
          {
            style: 'tableExample',
            table: {
              widths: [150, 370],
              body: [
                [{
                  image: 'logotipo',
                  width: 80,
                  height: 95,
                  alignment: 'center',
                  margin: [0, 0, 0, 0],
                  border: [false, false, false, false]
                }, {
                  text: 'AV. LAUDELINO GOMES QD 210 LT 01 N. 61 \nPEDRO LUDOVICO – GOIÂNIA - GO\n www.altispv.com.br',
                  alignment: 'center',
                  fontSize: 10,
                  height: 95,
                  margin: [0, 50, 0, 0],
                  border: [false, false, false, false]
                }
                ]
              ]
            }
          },
          {   // responsável
            style: 'tableExample',
            table: {
              widths: [568.5],
              heights: [30],

              body: [
                [{
                  text: `Responsável ALTIS: ${this.usuarioLogado.apelido}   - Whatsapp: (${this.usuarioLogado.ddd}) ${this.usuarioLogado.telefone}`,
                  fillColor: '#eeeeee',
                  margin: [5, 5, 0, 0],
                  border: [true, true, true, true],
                }],
                [{
                  text: `Associado : ${this.Cliente}  `,
                  fillColor: '#eeeeee',
                  margin: [5, 5, 0, 0],
                  border: [true, true, true, true],
                }]
              ]
            }
          },
          {   // Tabela Fipe
            style: 'tableExample',
            table: {
              widths: [200, 360],
              heights: [20],

              body: [
                [{
                  text: 'Marca/Modelo:',
                  margin: [5, 5, 0, 0],
                  border: [true, false, true, true],
                },
                {
                  text: `${this.proposta.marca} / ${this.proposta.modelo}`,
                  margin: [5, 5, 0, 0],
                  border: [true, false, true, true],
                }
                ],
                [{
                  text: 'Ano Modelo:',
                  margin: [5, 5, 0, 0],
                  border: [true, true, true, true],
                },
                {
                  text: `${this.proposta.anoModelo}`,
                  margin: [5, 5, 0, 0],
                  border: [true, true, true, true],
                }
                ],
                [{
                  text: 'Cód. FIPE',
                  margin: [5, 5, 0, 0],
                  border: [true, false, true, true],
                },
                {
                  text: `${this.proposta.codigoFipe}`,
                  margin: [5, 5, 0, 0],
                  border: [true, false, true, true],
                }
                ],
                [{
                  text: 'Valor fipe',
                  margin: [5, 5, 0, 0],
                  border: [true, true, true, true],
                },
                {
                  text: `${this.proposta.precoMedio}`,
                  margin: [5, 5, 0, 0],
                  border: [true, true, true, true],
                }
                ]

              ]
            }
          },
          {   // valores da proposta 
            style: 'tableExample',
            table: {
              widths: [200, 360],
              heights: [200],

              body: [
                [{
                  text: [ `Entrada:\n R$ ${numeral(this.proposta.entrada).format('00.00')}
                        \n\n Onze parcelas:\n`, 
                       {text:  '(plano anual)',  style: 'font14'},
                       `\n R$ ${numeral(this.proposta.mensalidade).format('00.00')}
                       ${parcelamentoRastreador} 
                      \n\n Cota de participação:\n R$ ${numeral(this.proposta.participacao).format('0,000.00')} `],
                  style: 'header',
                  margin: [15, 20, 0, 5],
                  border: [true, false, true, true],
                },
                {
                  text: [
                    {
                      text: 'COBERTURAS INCLUSAS',
                      alignment: 'center',
                      style: 'subheader',
                    },
                    {
                      text: `\n\nSem perfil de condutor! (Qualquer pessoa habilitada pode conduzir o veículo) 
                          \nSem Consulta SPC/SERASA 
                          \nSem limite de km rodado; Sem perfil de guarda de veículo, não exige garagem;
                          \nRoubo, furto, incêndio, colisão, capotamento, tombamento, desastres naturais como: enchente, chuva de granizo, queda de árvore; 
                          \nAssistência 24H em todo Brasil; 
                          \n${reboqueIlimitado}
                          \nSocorro elétrico e mecânico; Chaveiro; Taxi, SOS Pneus;
                          \nMensalidade Contínua (sem renovação); Não trabalhamos com Bônus; 
                          \n${normalLeilaoSisnsitro}
                          \n${this.proposta.terceiros}
                          \n${this.proposta.appDescricao}
                          \n${this.proposta.reboque}
                          \n${this.proposta.carroReserva}
                          \n${this.proposta.protecaoVidros}
                          \n${this.proposta.rastreador}
                          `,
                      fontSize: 9,
                    }
                  ],
                  margin: [5, 5, 0, 0],
                  border: [true, false, true, true],
                }
                ],
              ]
            }
          },
          {// texto OUTRAS COBERTURAS OPCIONAIS OFERECIDAS
            style: 'tableExample',
            table: { 
              widths: [568.5],
              heights: [30],
              body: [
                [{
                  text: [
                    { 
                      text:'OUTRAS COBERTURAS OPCIONAIS OFERECIDAS',
                      style: 'ParagrafoBold',
                      alignment: 'center',

                    },
                    {
                      text: `\n\n${this.fundoTerceiroOutros}
                      ${this.carroReservaOutros}
                      ${this.protecaoVidroOutros}
                      ${this.appOutros}
                      ${this.rastreadorOutros}`,
                      fontSize: 9,
                      alignment: 'left',
                    }
                  ], 
                  
                  margin: [0, 0, 0, 0],
                  
                  border: [true, false, true, true],
                }
              ]
              ]
            }
          },
          {   // texto informativo e validade da proposta
            style: 'tableExample',
            table: {
              widths: [568.5],
              heights: [30],
              body: [
                [{
                  text: `A ALTIS atua legalmente perante a lei, respeitando a constituição e o código civil. Não possui nenhum impedimento legal e se responsabiliza solidariamente com os princípios embasado nas leis* Lei no 9.790, de 23 de março de 1999.  / CAPÍTULO I / DA QUALIFICAÇÃO COMO ORGANIZAÇÃO DA SOCIEDADE CIVIL* Constituição da Republica Federativa do Brasil 1988 / TÍTULO II / Dos Direitos / Garantias Fundamentais / CAPÍTULO I / DOS DIREITOS E DEVERES INDIVIDUAIS E COLETIVOS / Art. 5º /Incisos: XVII a XXI.* Código Civil - Lei 10406/02 | Lei no 10.406, de 10 de janeiro de 2002 / TÍTULO II / Da Sociedade / CAPÍTULO II / DAS ASSOCIAÇÕES. 
                  
                  Validade: 15 dias a partir de ${this.hoje}. `,
                  fillColor: '#eeeeee',
                  margin: [5, 5, 5, 5],
                  alignment: 'left',
                  style: 'small',
                  border: [true, false, true, true],
                }]
              ]
            }
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true
          },
          subheader: {
            fontSize: 15,
            bold: true
          },
          ParagrafoBold: {
            fontSize: 12,
            bold: true
          },
          quote: {
            italics: true
          },
          font14: {
            fontSize: 14
          },
          small: {
            fontSize: 8
          },
        },
        images: { logotipo: img }
      };
      
      
      this.proposta.idUsuario = this.usuarioLogado.id;
      this.proposta.idPessoaUsuario = this.usuarioLogado.id_pessoa;
      this.proposta.idPessoaCliente = Number(this.idPessoaCliente);
      this.proposta.idTipoVeiculo = this.tipoVeiculoSelectValue;
      this.proposta.cota = this.cota;
      this.proposta.cotaAlterada = this.cotaAlterada;
      this.proposta.idStatusProposta = 3;
      this.proposta.idMotivo = 2;
      this.proposta.idPessoaDestinatario = this.usuarioLogado.id_pessoa;
      this.proposta.veiculoComercial = this.chckComercial;
      this.proposta.leilaoSinistrado = this.chckLeilaoSinistrado;
      this.proposta.portabilidade = this.chckPortabilidade; 
      this.proposta.parcelas = this.parcelasAdesao; 

          // caso a proposta tenha a cota alterada ou valor da mensalidade 
      if (this.cotaAlterada || this.proposta.mensalidadeAlterada ){ 
        this.proposta.idStatusProposta = 5;
        this.proposta.idMotivo = 3;
        this.proposta.idPessoaDestinatario = 5 // buscar supervisor das vendas internas 
    }

      this.propostaComuc.setProposta(this.proposta);

      if (!this.returnProp) {
        pdfMake.createPdf(docDefinition).open()
      }

      docDefinition.images.logotipo = ''; // retira  a imagem do logo para salvar

      this.propostaComuc.setPropostaJSON(docDefinition);

      const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }
      
      this.salvarProposta();

      if (!this.returnProp) {
        sleep(5000).then(() => {
          window.location.reload();
        })
      }

      this.proposta.observacao = '';

    }

    function fechar() { 
      document.getElementById("posiciona").style.display = 'none'; 
    }
  }

  async salvarProposta() {
        let paramsService = {
          proposta: JSON.stringify(this.propostaComuc.getProposta()).replace(/\#/gim, '%23'),
          propostaJSON: JSON.stringify(this.propostaComuc.getPropostaJSON()).replace(/\#/gim, '%23')
          //propostaJSON: {}
        };

        if (this.returnProp) {
          this.returnProposta.emit(paramsService)
        }
        else {
          try {
              await this.connectHTTP.callService({
                service: 'salvarProposta',
                paramsService
              });
              this.toastrService.success('Proposta salva com sucesso!');
          }catch (error) {
              console.log(error)
              this.toastrService.error('Proposta não salva');
              this.bntGeraProposta = true;
              return 0;
          }
        }

    }
    
  habilitaBntGeraProposta(){
    if( (this.chckPortabilidade || this.chckNovo) && 
        (this.chckParticular || this.chckComercial) &&
        (this.chckNormal || this.chckLeilaoSinistrado)
    ){
      this.bntGeraProposta = false;
    }
  }   
  
}