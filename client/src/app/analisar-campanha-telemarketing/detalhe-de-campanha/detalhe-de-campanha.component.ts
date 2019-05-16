import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { ToastService, IMyOptions } from '../../../lib/ng-uikit-pro-standard';
import { Usuario } from '../../login/usuario';
import * as moment from 'moment';


@Component({
  selector: 'app-detalhe-de-campanha',
  templateUrl: './detalhe-de-campanha.component.html',
  styleUrls: ['./detalhe-de-campanha.component.scss']
})
export class DetalheDeCampanhaComponent implements OnInit {

  idCampanha: number;
  nome: string;
  dataInicial: string;
  dataFinal: string;
  usuarioLogado: Usuario;
  detalheCampanhaStatus: Array<any> = [];
  detalheCampanhaStatusConsultor: Array<any> = [];
  detalheCampanhaStatusConsultorTodos: Array<any> = [];
  detalheCampanhaConsultor: Array<any> = [];
  detalheCampanhaConsultorStatus: Array<any> = [];
  detalheCampanhaConsultorStatusTodos: Array<any> = [];
  statusSelecionado: string;
  usuarioSelecionado: string;

  public myDatePickerOptions: IMyOptions = {
    // Strings and translations
    dayLabels: { su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sab' },
    dayLabelsFull: { su: "Domingo", mo: "Segunda", tu: "Terça", we: "Quarta", th: "Quinta", fr: "Sexta", sa: "Sábado" },
    monthLabels: { 1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez' },
    monthLabelsFull: { 1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril", 5: "Maio", 6: "Junho", 7: "Julho", 8: "Agosto", 9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro" },

    // Buttons
    todayBtnTxt: "Hoje",
    clearBtnTxt: "Limpar",
    closeBtnTxt: "Fechar",
    closeAfterSelect: true,

    // Format
    dateFormat: 'dd/mm/yyyy',
    selectionTxtFontSize: '15px',

  }

  constructor(    private route: ActivatedRoute,
    private connectHTTP: ConnectHTTP, 
    private localStorage: LocalStorage,
    private toastrService: ToastService) { 
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.route.params.subscribe(res => {
      let parametros = res.parametros;
      parametros = JSON.parse(parametros);
      this.idCampanha = parametros.idCampanha;
      this.nome = parametros.nome;
      this.dataInicial =  `${parametros.dataInicial.substring(8, 10)}/${parametros.dataInicial.substring(5, 7)}/${parametros.dataInicial.substring(0,4)}`
      this.dataFinal =  `${parametros.dataFinal.substring(8, 10)}/${parametros.dataFinal.substring(5, 7)}/${parametros.dataFinal.substring(0,4)}`
     });
  };

  ngOnInit() {
    this.getDetalheCampanha()
  }


  async getDetalheCampanha(){
  
      let retorno = await this.connectHTTP.callService({
        service: 'getDetalheCampanha',
        paramsService: {
          idCampanha: this.idCampanha,
          dtInicial: this.dataInicial,
          dtFinal: this.dataFinal
        }
      }) as any;

      this.detalheCampanhaStatus = retorno.resposta.detalheCampanhaStatus;
      this.detalheCampanhaStatusConsultorTodos = retorno.resposta.detalheCampanhaStatusConsultor;
      this.detalheCampanhaConsultor = retorno.resposta.detalheCampanhaConsultor;
      this.detalheCampanhaConsultorStatusTodos = retorno.resposta.detalheCampanhaConsultorStatus;

  }

    detalheStatus(id_resp_motivo, status_ligacao){
      this.statusSelecionado = status_ligacao
      this.detalheCampanhaStatusConsultor = this.detalheCampanhaStatusConsultorTodos.filter(t => t.id_resp_motivo == id_resp_motivo)

    }
    detalheUsuario(id_pessoa_resolveu, pessoa_resolveu ){
      this.usuarioSelecionado = pessoa_resolveu
      this.detalheCampanhaConsultorStatus = this.detalheCampanhaConsultorStatusTodos.filter(t => t.id_pessoa_resolveu == id_pessoa_resolveu )

    }

    voltar() {
      history.back();
    }
    
}
