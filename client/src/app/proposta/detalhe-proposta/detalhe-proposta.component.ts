import { async } from '@angular/core/testing';
import { Proposta } from './../proposta';
import { Component, OnInit, Input } from '@angular/core';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { Usuario } from '../../login/usuario';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { img } from '../imagem';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import * as numeral from 'numeral';
import 'numeral/locales';
import { BancoDados } from '../../shared/services/bancoDados';


numeral.locale('pt-br');
numeral(10000).format('0,0') // 10.000


@Component({
  selector: 'app-detalhe-proposta',
  templateUrl: './detalhe-proposta.component.html',
  styleUrls: ['./detalhe-proposta.component.scss']
})
export class DetalhePropostaComponent implements OnInit {

  carregando: boolean = false;
  proposta: any;
  pessoa: any;
  usuarioLogadoSupervisor: boolean;
  usuarioLogado: Usuario;
  idProposta: number;
  propostaForm: FormGroup;


  constructor(
    private route: ActivatedRoute,
    private connectHTTP: ConnectHTTP, 
    private localStorage: LocalStorage,
    private formBuilder: FormBuilder,
    private toastrService: ToastService,
    private bancoDados: BancoDados = new BancoDados,
    ) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.usuarioLogadoSupervisor = this.usuarioLogado.dashboard === "supervisor" || this.usuarioLogado.dashboard === "admin";
    this.route.params.subscribe(res => {
      this.idProposta = res.id
    }
    );
    this.propostaForm = this.formBuilder.group({
      id: [''],
      status: [''],
      id_status_proposta: [''],
      cliente: [''],
      placa:[''],
      tipo_veiculo: [''],
      marca:[''],
      modelo: [''],
      codigofipe: [''],
      ano_modelo:[''],
      preco_medio:[''],
      cota:[''],
      data_consulta:[''],
      adesao:['' ],
      mensalidade:['',],
      participacao:[''],
      app:[''],
      carro_reserva_:[''],
      fundo_terceiros_:[''],
      protecao_vidros_:[''],
      rastreador_:[''],
      usuario:[''],
      dtsalvou:[''],
      novoPortabilidade_:[''],
      particularComercial_:[''],
      normalLeilao_:[''],
      cotaAlterada:[''],
      parcelasAdesao:[''],
      parcelasRastreador: [''],
      rastreadorInstalacao: [''],
      entrada: [''],

    })
  }

  async ngOnInit() {
    await this.carregaProposta();

  }


  async carregaProposta() {
    this.carregando = true;
    let propostaEncontrada = await this.connectHTTP.callService({
      service: 'getPropostaPorId',
      paramsService: {
        id: this.idProposta
      }
    }) as any;
    this.proposta = propostaEncontrada.resposta[0];
    this.povoaFormulario();


    this.carregando = false;
  }

  povoaFormulario() {
    this.propostaForm.setValue({

      id: this.proposta.id,
      id_status_proposta: this.proposta.id_status_proposta,
      status: this.proposta.status_proposta,
      cliente: this.proposta.cliente,
      placa: this.proposta.placa,
      tipo_veiculo: this.proposta.tipo_veiculo_,
      marca:this.proposta.marca,
      modelo: this.proposta.modelo,
      codigofipe: this.proposta.codigofipe,     
      ano_modelo:this.proposta.ano_modelo,
      preco_medio:this.proposta.preco_medio,
      cota:this.proposta.cota,
      data_consulta:this.proposta.data_consulta,
      adesao: numeral(Number(this.proposta.adesao)).format('0.00'),
      mensalidade:numeral(Number(this.proposta.mensalidade)).format('0.00'),
      participacao:numeral(Number(this.proposta.participacao)).format('0,000.00'),
      app:this.proposta.app,
      carro_reserva_:this.proposta.carro_reserva_,
      fundo_terceiros_:this.proposta.fundo_terceiros_,
      protecao_vidros_:this.proposta.protecao_vidros_,
      rastreador_:this.proposta.rastreador_,
      novoPortabilidade_:this.proposta.novo_portabilidade_,
      particularComercial_:this.proposta.particular_comercial_,
      normalLeilao_:this.proposta.normal_leilao_,
      cotaAlterada:this.proposta.cota_alterada_,
      parcelasAdesao:this.proposta.parcelas_adesao,
      usuario:this.proposta.usuario,
      parcelasRastreador: this.proposta.parcelas_rastreador,
      rastreadorInstalacao: numeral(Number(this.proposta.rastreador_instalacao)).format('0.00'),
      entrada: numeral(Number(this.proposta.entrada)).format('0.00'),
      dtsalvou:this.proposta.dtsalvou ? moment(this.proposta.dtsalvou).format('DD/MM/YYYY HH:mm:ss') : this.proposta.dtsalvou,
    })    
    
    
    this.propostaForm.controls['id'].disable();
    this.propostaForm.controls['status'].disable();
    this.propostaForm.controls['id_status_proposta'].disable();
    this.propostaForm.controls['cliente'].disable();
    if (this.proposta.id_status_proposta != 3) {
    this.propostaForm.controls['placa'].disable();
    }else
    {
      this.propostaForm.controls['placa'].enable();
    }
    this.propostaForm.controls['tipo_veiculo'].disable();
    this.propostaForm.controls['marca'].disable();
    this.propostaForm.controls['modelo'].disable();
    this.propostaForm.controls['codigofipe'].disable();
    this.propostaForm.controls['ano_modelo'].disable();
    this.propostaForm.controls['preco_medio'].disable();
    this.propostaForm.controls['cota'].disable();
    this.propostaForm.controls['data_consulta'].disable();
    this.propostaForm.controls['adesao'].disable();
    this.propostaForm.controls['mensalidade'].disable();
    this.propostaForm.controls['participacao'].disable();
    this.propostaForm.controls['app'].disable();
    this.propostaForm.controls['carro_reserva_'].disable();
    this.propostaForm.controls['fundo_terceiros_'].disable();
    this.propostaForm.controls['protecao_vidros_'].disable();
    this.propostaForm.controls['rastreador_'].disable();
    this.propostaForm.controls['usuario'].disable();
    this.propostaForm.controls['dtsalvou'].disable();
    this.propostaForm.controls['novoPortabilidade_'].disable();
    this.propostaForm.controls['particularComercial_'].disable();
    this.propostaForm.controls['normalLeilao_'].disable();
    this.propostaForm.controls['cotaAlterada'].disable();
    this.propostaForm.controls['parcelasAdesao'].disable();
    this.propostaForm.controls['parcelasRastreador'].disable();
    this.propostaForm.controls['rastreadorInstalacao'].disable();
    this.propostaForm.controls['entrada'].disable();

    



  }


  openPDF(docDefinition) {
    let propostaPDF = JSON.parse(docDefinition.replace(/\%23/gim, '#'));
    propostaPDF.images = { logotipo: img }
    pdfMake.createPdf(propostaPDF).open()
  }

  voltar() {
    history.back();
  }



  async salvarPlacaDaProposta() {
    try {
      await this.connectHTTP.callService({
        service: 'salvarPlacaDaProposta',
        paramsService: {
          id: this.idProposta,
          placa: this.propostaForm.value.placa
        }
      });
      this.toastrService.success('Placa salva com sucesso');
    }
    catch (e) {
      this.toastrService.error('Erro ao salvar placa');
    }

  }

  async propostaAdmissao(){

    await this.getCliente();

    var docDefinition = {
      pageSize: 'A4',
      pageMargins: [10, 10, 5, 5],
      content: [
        {  // cabeçalho
          style: 'tableExample',
          table: {
            widths: [130, 270, 120],
            body: [
              [{
                image: 'logotipo',
                width: 80,
                height: 95,
                alignment: 'center',
                margin: [0, 0, 0, 0],
                border: [false, false, false, false]
              }, {
                text: `Altis Proteção Veicular e Benefícios
                Avenida Laudelino Gomes, nº 61, Qd. 210 Lt.38
                Setor Pedro Ludovico – Goiânia – GO
                CEP: 74830-090 – Telefone: (62) 3259-0830
                WhatsApp: (62) 9 8538-0830
                altisprotecaoveicular.com.br`
                ,
                alignment: 'center',
                fontSize: 10,
                height: 95,
                margin: [0, 20, 0, 0],
                border: [false, false, false, false]
              },
              {
                text: `Número: 
                ${this.proposta.id}`
                ,
                alignment: 'center',
                fontSize: 15,
                height: 95,
                margin: [0, 40, 0, 0],
                border: [false, false, false, false]
              }
              ]
            ]
          },
          
        },
        {   // Linha de título 
          style: 'tableExample',
          table: {
            widths: [568.5],
            heights: [20],

            body: [
              [{
                text: `PROPOSTA DE ADMISSÃO DE ASSOCIADO`,
                alignment: 'center',
                fontSize: 15,
                height: 75,
                color: '#FFFFFF',
                fillColor: '#000000',
                margin: [5, 5, 0, 0],
                border: [false, false, false, false],
              }],

            ]
          }
        },
        {   // Dados do associado   
          style: 'tableExample',
          table: {
            widths: [568.5],
            heights: [30],

            body: [
              [{
                text: 
                  `Associado: ${this.pessoa.nome}
                  CPF/CNPJ:   ${this.pessoa.cpf_cnpj_format}                                        Data de Nascimento: ${moment(this.pessoa.datanascimento).format('DD/MM/YYYY') }
                  CNH: ${this.pessoa.cnh}             Categoria: ${this.pessoa.cnh_categoria}             Validade: ${moment(this.pessoa.cnh_validade).format('DD/MM/YYYY')}
                  CEP:  ${this.pessoa.cep}        Endereço: ${this.pessoa.logradouro}      Complemento: ${this.pessoa.complemento}
                  Bairro: ${this.pessoa.bairro}     Cidade/UF: ${this.pessoa.cidade} - ${this.pessoa.uf}
                  Telefone:  ${this.pessoa.tel_1}     ${this.pessoa.tel_2}
                  E-mail: ${this.pessoa.email} \n`
                  
                  ,

                alignment: 'left',
                style: 'Paragrafo',
                margin: [5, 5, 0, 0],
                border: [false, false, false, false],
                lineHeight: 2
              }],

            ]
          }
        },
        {   // Texto 1   
          style: 'tableExample',
          table: {
            widths: [568.5],
            heights: [30],

            body: [
              [{
                text: `O proponente acima qualificado requer através do presente termo a admissão ao quadro de associados da ALTIS PROTEÇÃO VEICULAR E BENEFÍCIOS, CNPJ: 29.758.305/0001-49, nos termos de seu Estatuto Social, declarando estar ciente de seus direitos e deveres, bem como sujeito às obrigações previstas no referido estatuto, no regimento interno, regulamentos da associação e normas deliberativas de seus órgãos estatutários, no exato limite de suas respectivas competências.\n
                A ALTIS PROTEÇÃO VEICULAR é uma associação privada sem fins lucrativos, com base legal na Constituição Federal em seu artigo 5º, inc. XVII, XVIII, XIX, XX e XXI, bem como no Código Civil, em seu artigo 53 e seguintes, e tem como objetivo a defesa e promoção dos interesses de seus associados, com todas as suas atividades fundamentadas pelo princípio do associativismo.\n
                O proponente declara ainda serem exatas e verdadeiras todas as informações prestadas, estando ciente de que a eventual inexatidão das mesmas implicará a perda de direitos como associado, em analogia aos termos do art. 766 do Código Civil.\n`,
                style: 'Paragrafo',
                margin: [5, 5, 0, 0],
                border: [true, true, true, true],
              }],

            ]
          }
        },
          {   // linha branco
            style: 'tableExample',
            table: {
              widths: [568.5],
              heights: [10],
              body: [
                [{
                  text: ``,
                  style: 'Paragrafo',
                  margin: [5, 5, 0, 0],
                  border: [false, false, false, false],
                }],
              ]
            }
        },
        {   // Texto 2 
          style: 'tableExample',
          table: {
            widths: [568.5],
            heights: [30],

            body: [
              [{
                
                text: `Declaro, sob compromisso de honra que as informações que preenchi neste laudo são verdadeiras, assim como declaro que li, entendi e recebi cópia do estatuto e dos regulamentos interno da associação. Também estou ciente que posso encontrar no site da Altis, todos os regulamentos na área do associado.
                `,
                style: 'Paragrafo',
                margin: [5, 5, 0, 0],
                border: [true, true, true, true],
              }],

            ]
          }
        },
        {   // roda pé
          style: 'tableExample',
          table: {
            widths: [568.5],
            heights: [30],

            body: [
              [{
                text:[ 
                  {text:`\nDATA E ASSINATURA DO ASSOCIADO \n\n`},
                  {text:`\n__________________ DE ______________ DE _______________.\n`,
                  alignment: 'center', lineHeight: 1},
                  {text: `\n\n_____________________________\n
                       VISTORIADOR              `,
                       alignment: 'right', lineHeight: 0.5
                  },
                  {text: `\n\n\n\n_______________________________________\n
                  ASSOCIADO`, alignment: 'center', lineHeight: 0.5 } 
                ],
                  margin: [5, 5, 0, 0],
                  border: [false, false, false, false],
              }],

            ]
          }
        },
        // {   // Tabela Fipe
        //   style: 'tableExample',
        //   table: {
        //     widths: [200, 360],
        //     heights: [20],

        //     body: [
        //       [{
        //         text: 'Marca/Modelo:',
        //         margin: [5, 5, 0, 0],
        //         border: [true, false, true, true],
        //       },
        //       {
        //         text: `${this.proposta.marca} / ${this.proposta.modelo}`,
        //         margin: [5, 5, 0, 0],
        //         border: [true, false, true, true],
        //       }
        //       ],
        //       [{
        //         text: 'Ano Modelo:',
        //         margin: [5, 5, 0, 0],
        //         border: [true, true, true, true],
        //       },
        //       {
        //         text: `${this.proposta.anoModelo}`,
        //         margin: [5, 5, 0, 0],
        //         border: [true, true, true, true],
        //       }
        //       ],
        //       [{
        //         text: 'Cód. FIPE',
        //         margin: [5, 5, 0, 0],
        //         border: [true, false, true, true],
        //       },
        //       {
        //         text: `${this.proposta.codigoFipe}`,
        //         margin: [5, 5, 0, 0],
        //         border: [true, false, true, true],
        //       }
        //       ],
        //       [{
        //         text: 'Valor fipe',
        //         margin: [5, 5, 0, 0],
        //         border: [true, true, true, true],
        //       },
        //       {
        //         text: `${this.proposta.precoMedio}`,
        //         margin: [5, 5, 0, 0],
        //         border: [true, true, true, true],
        //       }
        //       ]

        //     ]
        //   }
        // },
        // {   // valores da proposta 
        //   style: 'tableExample',
        //   table: {
        //     widths: [200, 360],
        //     heights: [200],

        //     body: [
        //       [{
        //         text: [ `Entrada:\n R$ ${numeral(this.proposta.entrada).format('00.00')}
        //               \n\n Onze parcelas:\n`, 
        //              {text:  '(plano anual)',  style: 'font14'},
        //              `\n R$ ${numeral(this.proposta.mensalidade).format('00.00')}
        //              ${parcelamentoRastreador} 
        //             \n\n Cota de participação:\n R$ ${numeral(this.proposta.participacao).format('0,000.00')} `],
        //         style: 'header',
        //         margin: [15, 20, 0, 5],
        //         border: [true, false, true, true],
        //       },
        //       {
        //         text: [
        //           {
        //             text: 'COBERTURAS INCLUSAS',
        //             alignment: 'center',
        //             style: 'subheader',
        //           },
        //           {
        //             text: `\n\nSem perfil de condutor! (Qualquer pessoa habilitada pode conduzir o veículo) 
        //                 \nSem Consulta SPC/SERASA 
        //                 \nSem limite de km rodado; Sem perfil de guarda de veículo, não exige garagem;
        //                 \nRoubo, furto, incêndio, colisão, capotamento, tombamento, desastres naturais como: enchente, chuva de granizo, queda de árvore; 
        //                 \nAssistência 24H em todo Brasil; 
        //                 \n${reboqueIlimitado}
        //                 \nSocorro elétrico e mecânico; Chaveiro; Taxi, SOS Pneus;
        //                 \nMensalidade Contínua (sem renovação); Não trabalhamos com Bônus; 
        //                 \n${normalLeilaoSisnsitro}
        //                 \n${this.proposta.terceiros}
        //                 \n${this.proposta.appDescricao}
        //                 \n${this.proposta.reboque}
        //                 \n${this.proposta.carroReserva}
        //                 \n${this.proposta.protecaoVidros}
        //                 \n${this.proposta.rastreador}
        //                 `,
        //             fontSize: 9,
        //           }
        //         ],
        //         margin: [5, 5, 0, 0],
        //         border: [true, false, true, true],
        //       }
        //       ],
        //       // [
        //       //   {
        //       //     text: 'OUTRAS COBERTURAS OPCIONAIS OFERECIDAS',
        //       //     style: 'subheader',
        //       //     margin: [5, 25, 0, 0],
        //       //   },
        //       //   {
        //       //     text: `${produtoAdicionais1}
        //       //         \nAPP (ACIDENTES PESSOAIS DE PASSAGEIROS) até 20 mil;
        //       //         \nFundo para terceiros de 50 mil;
        //       //         \nFundo para terceiros de 70 mil.
        //       //         ` ,
        //       //     alignment: 'left',
        //       //     fontSize: 9,
        //       //     margin: [5, 0, 0, 0],
        //       //   }
        //       // ],
        //     ]
        //   }
        // },
        // {// texto OUTRAS COBERTURAS OPCIONAIS OFERECIDAS
        //   style: 'tableExample',
        //   table: { 
        //     widths: [568.5],
        //     heights: [30],
        //     body: [
        //       [{
        //         text: [
        //           { 
        //             text:'OUTRAS COBERTURAS OPCIONAIS OFERECIDAS',
        //             style: 'ParagrafoBold',
        //             alignment: 'center',

        //           },
        //           {
        //             text: `\n\n${this.fundoTerceiroOutros}
        //             ${this.carroReservaOutros}
        //             ${this.protecaoVidroOutros}
        //             ${this.appOutros}
        //             ${this.rastreadorOutros}`,
        //             fontSize: 9,
        //             alignment: 'left',
        //           }
        //         ], 
                
        //         margin: [0, 0, 0, 0],
                
        //         border: [true, false, true, true],
        //       }
        //     ]
        //     ]
        //   }
        // },
        // {   // texto informativo e validade da proposta
        //   style: 'tableExample',
        //   table: {
        //     widths: [568.5],
        //     heights: [30],
        //     body: [
        //       [{
        //         text: `A ALTIS atua legalmente perante a lei, respeitando a constituição e o código civil. Não possui nenhum impedimento legal e se responsabiliza solidariamente com os princípios embasado nas leis* Lei no 9.790, de 23 de março de 1999.  / CAPÍTULO I / DA QUALIFICAÇÃO COMO ORGANIZAÇÃO DA SOCIEDADE CIVIL* Constituição da Republica Federativa do Brasil 1988 / TÍTULO II / Dos Direitos / Garantias Fundamentais / CAPÍTULO I / DOS DIREITOS E DEVERES INDIVIDUAIS E COLETIVOS / Art. 5º /Incisos: XVII a XXI.* Código Civil - Lei 10406/02 | Lei no 10.406, de 10 de janeiro de 2002 / TÍTULO II / Da Sociedade / CAPÍTULO II / DAS ASSOCIAÇÕES. 
                
        //         Validade: 15 dias a partir de ${this.hoje}. `,
        //         fillColor: '#eeeeee',
        //         margin: [5, 5, 5, 5],
        //         alignment: 'left',
        //         style: 'small',
        //         border: [true, false, true, true],
        //       }]
        //     ]
        //   }
        // },
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
        Paragrafo: {
          alignment: 'justify',
          fontSize: 10,
          bold: false,
          lineHeight: 1.2,
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

    pdfMake.createPdf(docDefinition).open()





  }


  async getCliente(){

    this.pessoa = await this.bancoDados.lerDados('getPessoaDadosPrincipais', { id_pessoa: this.proposta.id_pessoa_cliente }) as any;
    this.pessoa = this.pessoa.resposta[0]; 
    console.log('pessoa', this.pessoa)

    
  }


}