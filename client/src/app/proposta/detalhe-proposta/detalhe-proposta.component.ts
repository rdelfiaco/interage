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
      adesao:[''],
      mensalidade:[''],
      participacao:[''],
      app:[''],
      carro_reserva_:[''],
      fundo_terceiros_:[''],
      protecao_vidros_:[''],
      rastreador_:[''],
      usuario:[''],
      dtsalvou:['']

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
      adesao:this.proposta.adesao,
      mensalidade:this.proposta.mensalidade,
      participacao:this.proposta.participacao,
      app:this.proposta.app,
      carro_reserva_:this.proposta.carro_reserva_,
      fundo_terceiros_:this.proposta.fundo_terceiros_,
      protecao_vidros_:this.proposta.protecao_vidros_,
      rastreador_:this.proposta.rastreador_,
      usuario:this.proposta.usuario,
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