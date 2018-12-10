import { style } from '@angular/animations';

import { Proposta } from '../proposta';
import { Component, OnInit, Input, EventEmitter, OnChanges, SimpleChanges, Type } from '@angular/core';
import { Usuario } from '../../login/usuario';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { Observable } from 'rxjs';

import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { ComunicaPropostaService } from '../comunica-proposta.service';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


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
  @Input() pessoa: any
  @Input() evento: any

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
  vlrPoposta: number;
  valorPPV: number;
  cota: number;
  adesao: number;
  vlrParticipacao: number;
  prcParticipacao: number;
 

  sVlrVeiculo: string;
  nVlrVeiculo: number;

  proposta: Proposta;

  // initValueId: string = '12';
  // idPessoaCliente: string;

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
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
    this.rastreadores = tabelaPrecos.resposta.Rastreador;  
    this.protecoesVidros = tabelaPrecos.resposta.ProtecaoVidros;
    this.fundosTerceiros = tabelaPrecos.resposta.FundoTerceiros; 
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
    proposta => {
      this.proposta = proposta;
      if (proposta.codigoFipe === undefined || proposta.codigoFipe  === null){
        this.valores = [];
        this.sVlrVeiculo =  ''
      }else {
          this.atualizaValorVeiculo(proposta )
      }
    }
    );
  }

  atualizaValorVeiculo(proposta_: Proposta){
    this.sVlrVeiculo = proposta_.precoMedio;
    this.atualizaTabelas();
  }

  atualizaTipoVeiculo(){

    this.chkPrecos = "6";

    this.atualizaTabelas()

  }


  atualizaTabelas(){
    
    this.nVlrVeiculo =  Number(this.sVlrVeiculo.substr(2,12).trim().replace('.','').replace(',','.'));
    if (this.tabelaCombos.length > 0){
      this.combos = this.tabelaCombos.filter( this.filtraTabelas, [this.nVlrVeiculo, this.tipoVeiculoSelectValue ]);
    }

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
        this.proposta.mensalidade = this.vlrPoposta;
        // quando for combro ajustar 
        this.proposta.adesão = this.adesao;
        this.proposta.participacao = this.vlrParticipacao; 


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
      if (this.tabelaCombos.length > 0)this.vlrPoposta = this.combos[this.chkPrecos].valor_combo;
    } else{
      this.vlrPoposta = Number(this.valorPPV);
      if ( this.fundoTerceiro.length > 0){
        this.vlrPoposta = this.vlrPoposta + Number(this.fundoTerceiro[this.chkFundo].valor );
        this.proposta.terceiros = this.fundoTerceiro[this.chkFundo].nome;
        this.proposta.idFundoTerceiros = this.fundoTerceiro[this.chkFundo].id ;
      };
      if (this.carroReserva.length > 0){
        this.vlrPoposta = this.vlrPoposta + Number(this.carroReserva[this.chckCarroRes].valor)
        this.proposta.idCarroReserva = this.carroReserva[this.chckCarroRes].id; 
      };
      if (this.protecaoVidro.length > 0) {
        this.vlrPoposta = this.vlrPoposta + Number(this.protecaoVidro[this.chckProtecaoVidro].valor)
        this.proposta.idProtecaoVidros = this.protecaoVidro[this.chckProtecaoVidro].id;
      };
      if (this.app.length){
        this.vlrPoposta = this.vlrPoposta + Number(this.app[this.chckApp].valor)
        this.proposta.idApp = this.app[this.chckApp].id;
      };
      if (this.rastreador.length > 0){
        this.vlrPoposta = this.vlrPoposta + Number( this.rastreador[this.chckRastreador].valor)
        this.proposta.idRastreador = this.rastreador[this.chckRastreador].id;
      };
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

  // onSelectCliente(valor) {
  //   this.idPessoaCliente = valor.value;
  // }

  geraProposta(){

    console.log(this.proposta)
    var docDefinition = {
      pageSize: 'A4',
      pageMargins: [ 10, 10, 5, 5 ],
      content: [ 

        {
          style: 'tableExample',
          table: {
            widths: [150, 380],
            body: [
              [ {
                image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4QBoRXhpZgAASUkqAAgAAAADABIBAwABAAAAAQAAADEBAgAQAAAAMgAAAGmHBAABAAAAQgAAAAAAAABTaG90d2VsbCAwLjI4LjIAAgACoAkAAQAAAEgBAAADoAkAAQAAANMBAAAAAAAA/+EJ9Gh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIzMjgiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSI0NjciIHRpZmY6SW1hZ2VXaWR0aD0iMzI4IiB0aWZmOkltYWdlSGVpZ2h0PSI0NjciIHRpZmY6T3JpZW50YXRpb249IjEiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUE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',
                width: 80,
                height: 95,
                alignment: 'center', 
                margin: [ 0, 0, 0, 0 ],
                border: [false, false, false, false]
              }, {
                text: 'AV. LAUDELINO GOMES QD 210 LT 01 N. 61 \nPEDRO LUDOVICO – GOIÂNIA - GO\n www.altispv.com.br', 
                alignment: 'center', 
                fontSize: 10,
                height: 95,
                margin: [ 0, 50, 0, 0 ],
                border: [false, false, false, false]
              }
            ]
          ]
          }
        },  
            {   // responsável
              style: 'tableExample',
              table: {
                widths: [570],
                heights: [30],
                
                body: [
                  [{ text: `Responsável ALTIS: ${this.usuarioLogado.nomeFantasia}  Whatsapp: ${this.usuarioLogado.telefonePrincipal} `,
                  fillColor: '#eeeeee', 
                  margin: [ 5, 5, 0, 0 ],
                  border: [true, true, true, true],
                    }]
                ]
              }
            },
            {   // Tabela Fipe
              style: 'tableExample',
              table: {
                widths: [200,360],
                heights: [20],
                
                body: [
                  [{ text: 'Marca/Modelo:',
                  margin: [ 5, 5, 0, 0 ],
                  border: [true, false, true, true],
                    },
                    { text: `${this.proposta.marca} / ${this.proposta.modelo}`,
                    margin: [ 5, 5, 0, 0 ],
                    border: [true, false, true, true],
                    } 
                  ],
                  [{ text: 'Ano Modelo:',
                  margin: [ 5, 5, 0, 0 ],
                  border: [true, true, true, true],
                    },
                    { text: `${this.proposta.anoModelo}`,
                    margin: [ 5, 5, 0, 0 ],
                    border: [true, true, true, true],
                    } 
                  ],
                  [{ text: 'Cód. FIPE',
                  margin: [ 5, 5, 0, 0 ],
                  border: [true, false, true, true],
                    },
                    { text: `${this.proposta.codigoFipe}`,
                    margin: [ 5, 5, 0, 0 ],
                    border: [true, false, true, true],
                    } 
                  ],
                  [{ text: 'Valor fipe',
                  margin: [ 5, 5, 0, 0 ],
                  border: [true, true, true, true],
                    },
                    { text: `${this.proposta.precoMedio}`,
                    margin: [ 5, 5, 0, 0 ],
                    border: [true, true, true, true],
                    } 
                  ]

                ]
              }
            },
            {   // valores da proposta 
              style: 'tableExample',
              table: {
                widths: [200,360],
                heights: [200],
                
                body: [
                  [{ 
                    text: `ADESÃO:\n R$ ${this.proposta.adesão}
                    \n\n MENSALIDADE:\n R$ ${this.proposta.mensalidade} 
                    \n\n PARTICIPAÇÃO:\n R$ ${this.proposta.participacao}
                    \n\n ${this.proposta.terceiros}`,
                    style: 'header',
                    margin: [ 15, 20, 0, 5 ],
                    border: [true, false, true, true],
                  },
                    { 
                      text: [ 
                        {text: 'COBERTURAS OFERECIDAS',
                        alignment: 'center',
                        style: 'subheader',
                        },
                        {text: `\n\nSem perfil de condutor! (Qualquer pessoa habilitada pode conduzir o veículo) 
                        \nSem Consulta SPC/SERASA 
                        \nSem limite de km rodado; Sem perfil de guarda de veículo, não exige garagem;
                        \nCarro Reserva (Opcional);
                        \nRoubo, furto, incêndio, colisão, capotamento, tombamento, enchente, chuva de granizo, queda de árvore; 
                        \nAssistência 24H em todo Brasil; 
                        \nReboque do veículo –1000 km (500 km ida e 500 km volta) até 6x ao mês;  
                        \nSocorro elétrico e mecânico; Chaveiro; Taxi, SOS Pneus;
                        \nMensalidade Contínua (sem renovação); Não trabalhamos com Bônus; 
                        \nIndenização 100% tabela Fipe, exceto veículos de leilão e remarcados( 80% DE IDENIZAÇAO)
                        \n`,
                        fontSize: 10
                        } 
                    ],
                      margin: [ 5, 5, 0, 0 ],
                      border: [true, false, true, true],
                  }
                ],
                [
                  {text: 'PRODUTOS ADICIONAIS',
                  style: 'subheader',
                  margin: [ 5, 25, 0, 0 ],
                  },
                  {
                      text: `Carro reserva de 30 dias*
                      APP (ACIDENTES PESSOAIS DE PASSAGEIROS) *
                      Fundo para terceiros de 50 mil*
                      Fundo para terceiros de 70 mil*
                      ` ,
                      alignment: 'center',
                      style: 'ParagrafoBold',
                      margin: [ 5, 0, 0, 0 ],
                  }
                ],
              ]
            }
          },
          {   // responsável
            style: 'tableExample',
            table: {
              widths: [570],
              heights: [30],
              body: [
                [{
                  text: `A ALTIS atua legalmente perante a lei, respeitando a constituição e o código civil. Não possui nenhum impedimento legal e se responsabiliza solidariamente com os princípios embasado nas leis* Lei no 9.790, de 23 de março de 1999.  / CAPÍTULO I / DA QUALIFICAÇÃO COMO ORGANIZAÇÃO DA SOCIEDADE CIVIL* Constituição da Republica Federativa do Brasil 1988 / TÍTULO II / Dos Direitos / Garantias Fundamentais / CAPÍTULO I / DOS DIREITOS E DEVERES NDIVIDUAIS E COLETIVOS / Art. 5º /Incisos: XVII a XXI.* Código Civil - Lei 10406/02 | Lei no 10.406, de 10 de janeiro de 2002 / TÍTULO II / Da Sociedade / CAPÍTULO II / DAS ASSOCIAÇÕES
                `,
                  fillColor: '#eeeeee', 
                  margin: [ 5, 5, 5, 5 ],
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
        small: {
          fontSize: 8
        }
      }
    };
    
   
    this.proposta.idPessoaUsuario = this.usuarioLogado.id;
    this.proposta.idPessoaCliente =  200; //Number(this.idPessoaCliente);
    this.propostaComuc.setProposta(this.proposta);
    this.propostaComuc.setPropostaJSON(docDefinition) 

    this.salvarProposta();

    

    //pdfMake.createPdf(docDefinition).open();

  }

  async salvarProposta() {
    console.log(' getProposta ', this.propostaComuc.getProposta());
    try {
      await this.connectHTTP.callService({
        service: 'salvarProposta',
        paramsService: {
          id_usuario: this.usuarioLogado.id,
          token: this.usuarioLogado.token,
          proposta: JSON.stringify( this.propostaComuc.getProposta()),
          propostaJSON: JSON.stringify( this.propostaComuc.getPropostaJSON())
        }
      });
      this.toastrService.success('Prposta salva com sucesso!');
      this.aba.setAba(5);
    }
    catch (e) {
      this.toastrService.error('Proposta não salva');
    }
  }


}