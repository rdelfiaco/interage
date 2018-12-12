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
import { img } from '../imagem';

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

  initValueId: Observable<any>;
  idPessoaCliente: string;

  // radios 
  chkPrecos: string = "6";
  chkFundo: string = "1";
  chckCarroRes: string = "1";
  chckProtecaoVidro: string = "0";
  chckApp: string = "1";
  chckRastreador: string = "0";
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

    this.initValueId = new Observable((observer) => {
      observer.next('14');
    });
    // combo tipo do veículo 
    this.tipoVeiculoSelect = tabelaPrecos.resposta.TipoVeiculos;
    this.tipoVeiculoSelect = this.tipoVeiculoSelect.map(tipoVeiculo => {
      return { value: tipoVeiculo.id, label: tipoVeiculo.nome }
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
  }

  atualizaValorVeiculo(proposta_: Proposta) {
    this.sVlrVeiculo = proposta_.precoMedio;
    this.atualizaTabelas();
  }

  atualizaTipoVeiculo() {
    this.atualizaTabelas()
  }


  atualizaTabelas() {
    this.nVlrVeiculo = Number(this.sVlrVeiculo.substr(2, 12).trim().replace('.', '').replace(',', '.'));
    if (this.tabelaCombos.length > 0) {
      this.combos = this.tabelaCombos.filter(this.filtraTabelas, [this.nVlrVeiculo, this.tipoVeiculoSelectValue]);
    }
    this.valores = this.tabelaValores.filter(this.filtraTabelas, [this.nVlrVeiculo, this.tipoVeiculoSelectValue]);

    this.fundoTerceiro = this.fundosTerceiros.filter(this.filtraTabelasTipoVeiculos, [this.tipoVeiculoSelectValue]);

    this.carroReserva = this.carrosReservas.filter(this.filtraTabelasTipoVeiculos, [this.tipoVeiculoSelectValue]);

    this.protecaoVidro = this.protecoesVidros.filter(this.filtraTabelasTipoVeiculos, [this.tipoVeiculoSelectValue]);

    this.rastreador = this.rastreadores.filter(this.filtraTabelasTipoVeiculos, [this.tipoVeiculoSelectValue]);

    this.app = this.apps.filter(this.filtraTabelasTipoVeiculos, [this.tipoVeiculoSelectValue]);

    if (this.valores) {
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


    } else {
      this.toastrService.error('Tabela correspondente não encontrada')
    }
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
    if (this.chkPrecos != "6") {
      if (this.tabelaCombos.length > 0) this.vlrPoposta = this.combos[this.chkPrecos].valor_combo;
    } else {
      this.vlrPoposta = Number(this.valorPPV);
      if (this.fundoTerceiro.length > 0) {
        this.vlrPoposta = this.vlrPoposta + Number(this.fundoTerceiro[this.chkFundo].valor);
        this.proposta.terceiros = this.fundoTerceiro[this.chkFundo].nome;
        this.proposta.idFundoTerceiros = this.fundoTerceiro[this.chkFundo].id;
      };
      if (this.carroReserva.length > 0) {
        this.vlrPoposta = this.vlrPoposta + Number(this.carroReserva[this.chckCarroRes].valor)
        this.proposta.idCarroReserva = this.carroReserva[this.chckCarroRes].id;
      };
      if (this.protecaoVidro.length > 0) {
        this.vlrPoposta = this.vlrPoposta + Number(this.protecaoVidro[this.chckProtecaoVidro].valor)
        this.proposta.idProtecaoVidros = this.protecaoVidro[this.chckProtecaoVidro].id;
      };
      if (this.app.length) {
        this.vlrPoposta = this.vlrPoposta + Number(this.app[this.chckApp].valor)
        this.proposta.idApp = this.app[this.chckApp].id;
      };
      if (this.rastreador.length > 0) {
        this.vlrPoposta = this.vlrPoposta + Number(this.rastreador[this.chckRastreador].valor)
        this.proposta.idRastreador = this.rastreador[this.chckRastreador].id;
      };
    }
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
  }


  geraProposta() {
    debugger
    var docDefinition = {
      pageSize: 'A4',
      pageMargins: [10, 10, 5, 5],
      content: [
        {
          style: 'tableExample',
          table: {
            widths: [150, 380],
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
            widths: [570],
            heights: [30],

            body: [
              [{
                text: `Responsável ALTIS: ${this.usuarioLogado.apelido}   - Whatsapp: (${this.usuarioLogado.ddd}) ${this.usuarioLogado.telefone}`,
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
                text: `ADESÃO:\n R$ ${this.proposta.adesão}
                    \n\n MENSALIDADE:\n R$ ${this.proposta.mensalidade} 
                    \n\n PARTICIPAÇÃO:\n R$ ${this.proposta.participacao}
                    \n\n ${this.proposta.terceiros}`,
                style: 'header',
                margin: [15, 20, 0, 5],
                border: [true, false, true, true],
              },
              {
                text: [
                  {
                    text: 'COBERTURAS OFERECIDAS',
                    alignment: 'center',
                    style: 'subheader',
                  },
                  {
                    text: `\n\nSem perfil de condutor! (Qualquer pessoa habilitada pode conduzir o veículo) 
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
                margin: [5, 5, 0, 0],
                border: [true, false, true, true],
              }
              ],
              [
                {
                  text: 'PRODUTOS ADICIONAIS',
                  style: 'subheader',
                  margin: [5, 25, 0, 0],
                },
                {
                  text: `Carro reserva de 30 dias*
                      APP (ACIDENTES PESSOAIS DE PASSAGEIROS) *
                      Fundo para terceiros de 50 mil*
                      Fundo para terceiros de 70 mil*
                      ` ,
                  alignment: 'center',
                  style: 'ParagrafoBold',
                  margin: [5, 0, 0, 0],
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
        small: {
          fontSize: 8
        }
      },
      images : { logotipo: img }
    };


    this.proposta.idUsuario = this.usuarioLogado.id;
    this.proposta.idPessoaUsuario = this.usuarioLogado.id_pessoa;
    this.proposta.idPessoaCliente = Number(this.idPessoaCliente);
    this.proposta.idTipoVeiculo = this.tipoVeiculoSelectValue;
    this.proposta.cota = this.cota;
    this.propostaComuc.setProposta(this.proposta);
    //pdfMake.createPdf(docDefinition).open()
    docDefinition.images.logotipo = ''; // para salvar a imagem do logo 

    this.propostaComuc.setPropostaJSON(docDefinition)

    this.salvarProposta();

    

  }

  async salvarProposta() {
    console.log(' getProposta ', this.propostaComuc.getProposta());
    try {
      await this.connectHTTP.callService({
        service: 'salvarProposta',
        paramsService: {
          id_usuario: this.usuarioLogado.id,
          token: this.usuarioLogado.token,
          proposta: JSON.stringify(this.propostaComuc.getProposta()).replace(/\#/gim, '%23'),
          propostaJSON: JSON.stringify(this.propostaComuc.getPropostaJSON()).replace(/\#/gim, '%23')
        }
      });
      this.toastrService.success('Proposta salva com sucesso!');

      document.location.reload(true); 

    }
    catch (e) {
      this.toastrService.error('Proposta não salva');
    }
  }


}