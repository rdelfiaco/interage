import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { ToastService, IMyOptions } from '../../../lib/ng-uikit-pro-standard';
import { Usuario } from '../../login/usuario';
import * as moment from 'moment';
import { TreeviewItem, TreeviewConfig, DropdownTreeviewComponent, TreeviewHelper, TreeviewI18n } from 'ngx-treeview';
import { throwIfEmpty } from 'rxjs/operators';

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
  questRespSintetica: Array<any> = [];
  questRespAnalitica = [];
  statusSelecionado: string;
  usuarioSelecionado: string;
  items_: TreeviewItem[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: true,
    maxHeight: 900
  });


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

  constructor(private route: ActivatedRoute,
    private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private toastrService: ToastService) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.route.params.subscribe(res => {
      let parametros = res.parametros;
      parametros = JSON.parse(parametros);
      this.idCampanha = parametros.idCampanha;
      this.nome = parametros.nome;
      this.dataInicial = `${parametros.dataInicial.substring(8, 10)}/${parametros.dataInicial.substring(5, 7)}/${parametros.dataInicial.substring(0, 4)}`
      this.dataFinal = `${parametros.dataFinal.substring(8, 10)}/${parametros.dataFinal.substring(5, 7)}/${parametros.dataFinal.substring(0, 4)}`
    });
  };

  async ngOnInit() {
    await this.getDetalheCampanha()
    this.items_ = this.treeViewquestRespSintetica();
  }

  async getDetalheCampanha() {
    const retorno = await this.connectHTTP.callService({
      service: 'getDetalheCampanha',
      paramsService: {
        idCampanha: this.idCampanha,
        dtInicial: this.dataInicial,
        dtFinal: this.dataFinal
      }
    }) as any;
    console.log(retorno.resposta)
    this.detalheCampanhaStatus = retorno.resposta.detalheCampanhaStatus;
    this.detalheCampanhaStatusConsultorTodos = retorno.resposta.detalheCampanhaStatusConsultor;
    this.detalheCampanhaConsultor = retorno.resposta.detalheCampanhaConsultor;
    this.detalheCampanhaConsultorStatusTodos = retorno.resposta.detalheCampanhaConsultorStatus;
    this.questRespSintetica = retorno.resposta.questRespSintetica;
    if (this.questRespSintetica[0].nome_questionario == null) { this.questRespSintetica = []; }
  }

  detalheStatus(id_resp_motivo, status_ligacao) {
    this.statusSelecionado = status_ligacao;
    this.detalheCampanhaStatusConsultor = this.detalheCampanhaStatusConsultorTodos.filter(t => t.id_resp_motivo === id_resp_motivo);
  }

  detalheUsuario(id_pessoa_resolveu, pessoa_resolveu) {
    this.usuarioSelecionado = pessoa_resolveu;
    this.detalheCampanhaConsultorStatus = this.detalheCampanhaConsultorStatusTodos.filter(t => t.id_pessoa_resolveu === id_pessoa_resolveu);

  }

  voltar() {
    history.back();
  }

  transformData(dt_resposta) {
    return moment(dt_resposta).format('DD/MM/YYYY');
  }

  get getTitleAnalitico() {
    if (this.questRespAnalitica.length) {
      return ' - ' + this.questRespAnalitica[0]['pergunda'] + this.questRespAnalitica[0]['alternativa'];
    }
    return '';
  }

  async getRespAnalitico(idAlternativa) {
    const retorno = await this.connectHTTP.callService({
      service: 'getQuestRespAnalitica',
      paramsService: { idAlternativa }
    }) as any;
    return retorno.resposta;
  }

  async onSelectedChange(a: any) {
    let data = [];
    for (let index = 0; index < a.length; index++) {
      const element = a[index];
      const ret = await this.getRespAnalitico(element);
      if (ret[0].cliente && ret[0].dt_resposta) {
        data = [...data, ...ret];
      }
    }
    this.questRespAnalitica = data;
  }

  onFilterChange(a: any) {
    console.log(a);
  }

  povoaAlternativas(id_pergunta: any) {
    const alternativa = this.questRespSintetica.filter((r) => {
      if (r.id_pergunta === id_pergunta && r.id_alternativa != null) { return true; }
    }).map((c: any) => {
      return {
        // text: `${c.alternativa} = ${c.tot_resp}` + (c.proxima_pergunta ? ' -> Próxima pergunta: ' + c.proxima_pergunta : ''),
        text: `${c.alternativa}` + (c.proxima_pergunta ? ' -> Próx. Perg: ' + c.proxima_pergunta : ''),
        value: c.id_alternativa,
        collapsed: false,
        checked: false,
        children: []
      };
    });
    return alternativa;
  }

  povoaPerguntas(id_questionario: any) {
    const perguntas = [];
    this.questRespSintetica.forEach((item) => {
      const index = perguntas.findIndex(redItem => {
        return item.id_pergunta === redItem.id_pergunta;
      });
      if (index > -1) {
        perguntas[index].tot_resp = perguntas[index].tot_resp + item.tot_resp;
      } else {
        perguntas.push(item);
      }
    });
    console.log('per.', perguntas);
    return perguntas.map((item) => {
      return {
        text: `${item.pergunta}  ${item.tipo_pergunta > 2 ? ' = ' + item.tot_resp : ''}`,
        value: item.id_pergunta,
        collapsed: true,
        checked: false,
        children: this.povoaAlternativas(item.id_pergunta)
      };
    });
  }

  povoaQuestionario() {
    const questionario = {
      text: this.questRespSintetica[0].nome_questionario,
      value: this.questRespSintetica[0].id_questionario,
      collapsed: true,
      checked: false,
      children: this.povoaPerguntas(this.questRespSintetica[0].id_questionario)
    };
    return questionario;
  }

  treeViewquestRespSintetica(): TreeviewItem[] {
    const questionario = new TreeviewItem(this.povoaQuestionario());
    return [questionario];
  }
}
