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
  usuarioLogadoSupervisor: boolean;
  usuarioLogado: Usuario;
  idProposta: number;
  propostaForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private connectHTTP: ConnectHTTP, 
    private localStorage: LocalStorage,
    private formBuilder: FormBuilder,
    private toastrService: ToastService) {
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

  ngOnInit() {
    this.carregaProposta();
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
    console.log(this.proposta)
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
}