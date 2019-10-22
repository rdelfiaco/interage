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
      renavam:[''],
      chassi:[''],
      n_do_motor:[''],
      cor_veiculo:[''],
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
      renavam: this.proposta.renavam,
      chassi: this.proposta.chassi ,
      n_do_motor: this.proposta.n_do_motor,
      cor_veiculo: this.proposta.cor_veiculo, 
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
      this.propostaForm.controls['renavam'].disable();
      this.propostaForm.controls['chassi'].disable();
      this.propostaForm.controls['n_do_motor'].disable();
      this.propostaForm.controls['cor_veiculo'].disable(); 
      this.propostaForm.controls['ano_modelo'].disable();

    }else
    {
      this.propostaForm.controls['placa'].enable();
      this.propostaForm.controls['renavam'].enable();
      this.propostaForm.controls['chassi'].enable();
      this.propostaForm.controls['n_do_motor'].enable();
      this.propostaForm.controls['cor_veiculo'].enable(); 
      this.propostaForm.controls['ano_modelo'].enable();

    }
    this.propostaForm.controls['tipo_veiculo'].disable();
    this.propostaForm.controls['marca'].disable();
    this.propostaForm.controls['modelo'].disable();
    this.propostaForm.controls['codigofipe'].disable();
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

  async salvarDadosVeiculoDaProposta() {
    try {
      await this.connectHTTP.callService({
        service: 'salvarDadosVeiculoDaProposta',
        paramsService: {
          id: this.idProposta,
          placa: this.propostaForm.value.placa,
          renavam: this.propostaForm.value.renavam,
          chassi: this.propostaForm.value.chassi ,
          n_do_motor: this.propostaForm.value.n_do_motor,
          cor_veiculo: this.propostaForm.value.cor_veiculo, 
          ano_modelo: this.propostaForm.value.ano_modelo, 
        }
      });
      this.toastrService.success('Dados do veículo salva com sucesso');
    }
    catch (e) {
      this.toastrService.error('Erro ao salvar dados do veículo');
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
                color: '#FFFFFF',
                fillColor: '#000000',
                margin: [5, 2, 0, 0],
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
                lineHeight: 2,
                fontSize: 12,
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

  async propostaAdesao(){

    await this.getCliente();

    console.log('proposta', this.proposta)
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
            heights: 10,

            body: [
              [{
                text: `TERMO DE ADESÃO AO PROGRAMA DE PROTEÇÃO VEICULAR`,
                alignment: 'center',
                fontSize: 10,
                color: '#FFFFFF',
                fillColor: '#000000',
                margin: [5, 1, 0, 0],
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
                text:[ 
                 { text: `Associado: ${this.pessoa.nome}
                  CPF/CNPJ:   ${this.pessoa.cpf_cnpj_format}              Cidade/UF: ${this.pessoa.cidade} - ${this.pessoa.uf}\n`
                  ,
                  lineHeight: 1.2,
                  fontSize: 12,
                }, { text: `O associado acima qualificado requer através do presente termo, sua adesão ao Programa de Proteção Veicular da ALTIS PROTEÇÃO VEICULAR E BENEFÍCIOS, CNPJ: 29.758.305/0001-49, declarando estar ciente de seus direitos, deveres e obrigações, bem como sujeito aos termos dos Estatuto Social e Regulamento do Programa de Proteção Veicular, cuja cópia declara haver recebido no momento da assinatura do presente termo. 
                O PROGRAMA DE PROTEÇÃO VEICULAR (PPV) NÃO DEVE SER CONFUNDIDO EM HIPÓTESE ALGUMA COM SEGURO, TRATANDO-SE DE UM PLANO DE SOCORRO MÚTUO ENTRE SEUS ASSOCIADOS, LEIA ATENTAMENTE AS REGRAS A SEGUIR E O REGULAMENTO DO PROGRAMA.`
                }
                ],
                alignment: 'justify',
                style: 'Paragrafo',
                margin: [5, 5, 0, 0],
                border: [false, false, false, false],

              }],

            ]
          }
        },
        {   // Linha de título 
          style: 'tableExample',
          table: {
            widths: [568.5],
            heights: [10],
            body: [
              [{
                text: `DADOS DO VEÍCULO`,
                alignment: 'center',
                fontSize: 10,
                color: '#FFFFFF',
                fillColor: '#000000',
                margin: [5, 1, 0, 0],
                border: [false, false, false, false],
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
                text: `MARCA/MODELO: ${this.proposta.marca} / ${this.proposta.modelo}   COR: ${this.proposta.cor_veiculo}   ANO/MOD: ${this.proposta.ano_modelo}
                 COD.FIPE: ${this.proposta.codigofipe}    PLACA: ${this.proposta.placa} RENAVAM: ${this.proposta.renavam}
                CHASSI: ${this.proposta.chassi}     Nº DO MOTOR: ${this.proposta.n_do_motor}
                Vistoria: Descreva as avarias do veículo vistoriado, deverá ser observado as seguintes peças; Lataria (casco), pintura, lanternas, vidros, pneus
                ________________________________________________________________________________________________________________________
                ________________________________________________________________________________________________________________________
                ________________________________________________________________________________________________________________________
                `,
                style: 'Paragrafo',
                margin: [5, 5, 0, 0],
                border: [false, false, false, false],
                lineHeight: 1.2,
              }],

            ]
          }
        },
        {   // Linha de título 
          style: 'tableExample',
          table: {
            widths: [568.5],
            heights: 10,
            body: [
              [{
                text: `OPÇÕES DE SERVIÇOS E BENEFÍCIOS`,
                alignment: 'center',
                fontSize: 10,
                color: '#FFFFFF',
                fillColor: '#000000',
                margin: [5, 1, 0, 0],
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
                text: `PPV+ASSIST. 24H   ${this.proposta.reboque} 
                ${this.proposta.fundo_terceiros_}       ${this.proposta.protecao_vidros_}      ${this.proposta.carro_reserva_}  
                ${this.proposta.app}            ${this.proposta.rastreador_} `,
                style: 'Paragrafo',
                margin: [5, 2, 0, 0],
                border: [false, false, false, false],
                fontSize: 12,
                bold: false,
                lineHeight: 1.2,
              }],
            ]
          }
        },

        {   // Texto 3
          style: 'tableExample',
          table: {
            widths: [568.5],
            heights: [30],

            body: [
              [{
                text: `*Para serviços contratados, vide regulamento. 
                OBSERVAÇÕES: O associado declara estar ciente de:
                •	Que somente terá direto às coberturas caso o veiculo esteja sendo conduzido por condutor devidamente habilitado e com habilitação válida dentro da vigência.
                •	Que não há estipulação de prazo para entrega do veículo em caso de reparos provenientes de acidentes, visto que a monta dos danos sofridos, a disponibilidade de oficinas e a disponibilidade de peças no mercado fogem do controle da associação.
                •	Que se desejar se desligar do PPV deverá encaminhar um requerimento preenchido para a associação, devendo o associado estar adimplente com todas as suas obrigações relativas ao PPV.
                •	Que os benefícios do PPV para veículos do associado cadastrado têm início às 48h (quarenta e oito horas) úteis após a data de realização da vistoria do veículo e do pagamento da taxa de adesão (sendo necessário ambos para cobertura). 
                `,
                margin: [0, 2, 0, 0],
                border: [false, false, false, false],
                fontSize: 8,
                bold: false,
                lineHeight: 1,
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
                text: `Declaro que todas as informações que preenchi neste laudo são exatas e verdadeiras, assim como declaro que li, entendi e recebi a cópia deste laudo e o regulamento do PPV. Estou ciente que a eventual inexatidão destas informações implicará na perda total dos direitos como associado, em analogia ao termo do Artigo 766 do Código Civil. `,
                style: 'Paragrafo',
                margin: [5, 1, 0, 0],
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
                  {text:`DATA E ASSINATURA DO ASSOCIADO \n`},
                  {text:`\n__________________ DE ______________ DE _______________.\n`,
                  alignment: 'center', lineHeight: 1},
                  {text: `\n_____________________________\n
                       VISTORIADOR              `,
                       alignment: 'right', lineHeight: 0.5
                  },
                  {text: `\n_______________________________________\n
                  ASSOCIADO`, alignment: 'center', lineHeight: 0.5 } 
                ],
                  margin: [5, 0, 0, 0],
                  border: [false, false, false, false],
              }],
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