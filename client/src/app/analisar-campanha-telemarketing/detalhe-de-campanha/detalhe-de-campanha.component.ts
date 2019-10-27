import { element } from 'protractor';
import { async } from '@angular/core/testing';
import { Component, OnInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { ToastService, IMyOptions } from '../../../lib/ng-uikit-pro-standard';
import { Usuario } from '../../login/usuario';
import * as moment from 'moment';
import { TreeviewItem, TreeviewConfig, DropdownTreeviewComponent, TreeviewHelper, TreeviewI18n } from 'ngx-treeview';
import { throwIfEmpty } from 'rxjs/operators';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { RandomColor } from '../../shared/services/randomColor';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { img } from '../../proposta/imagem';
import * as html2canvas from 'html2canvas';

import { Chart } from 'chart.js';


// const baseConfig: Chart.ChartConfiguration = {
//   type: 'bar',
//   options: {
//     responsive: true,
//     maintainAspectRatio: false,
//     legend: { display: true },
//     scales: {
//       xAxes: [{ display: true }],
//       yAxes: [{ display: true }],
//     }
//   }
// };

var baseConfig: Chart.ChartConfiguration = {
  type: 'bar',
  options: {
    responsive: true,
    maintainAspectRatio: false,
    legend: { display: true },
    scales: {
      xAxes: [{ display: true }],
      yAxes: [{ display: true ,
        ticks: {
          beginAtZero: true
      }}],
    },
  //   title: {
  //     display: true,
  //     text: 'Custom Chart Title'
  // }
  }
};



@Component({
  selector: 'app-detalhe-de-campanha',
  templateUrl: './detalhe-de-campanha.component.html',
  styleUrls: ['./detalhe-de-campanha.component.scss']
})
export class DetalheDeCampanhaComponent implements OnInit {

  @ViewChildren('pr_chart', { read: ElementRef }) chartElementRefs: QueryList<ElementRef>;
  charts: Chart[] = [];
  optionsBar: Chart.CharOption[] = [];
  chartData: Chart.ChartData[] = [];
  
  formularioGraficoResposta: boolean = false;
  idCampanha: number;
  nome: string;
  dataInicial: any;
  dataFinal: any;
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
  titulo: string;
  chartPerguntas: any;
  labels: Array<any> = [];
  datasets: Array<any> = [];
  perguntasQuest: Array<any> = [];
  alternativasPeguntas: Array<any> = []; 

  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 700
  });

  public chartTypeIB: string = 'bar' // 'pie';

  public chartDatasetsIB: Array<any> = [
    { data: [300, 50, 100, 40], label: 'Todos' },
  ];

  public chartLabelsIB: Array<any> = ['Ativas', 'Em negociação', 'Recusadas', 'Canceladas'];
  public chartIdLabelsIB: Array<any> = [1,2,3];

  public chartColorsIB: Array<any> = [
    {
      backgroundColor: ['#FDB45C', '#46BFBD', '#F7464A', '#949FB1'],
      hoverBackgroundColor: ['#FFC870', '#5AD3D1', '#FF5A5E', '#A8B3C5'],
      borderWidth: 1,
    }
  ];

  backgroundColor: ['#FDB45C', '#46BFBD', '#F7464A', '#949FB1'];
  hoverBackgroundColor: ['#FFC870', '#5AD3D1', '#FF5A5E', '#A8B3C5'];

  public chartOptionsIB: any = {
    responsive: true,
    legend: { display: false },
    scales: {
      xAxes: [{ display: true }],
      yAxes: [{ display: true ,
        ticks: {
          beginAtZero: true
      }}]
    }
  };

  public chartClickedIB(e: any): void { 

    let index = e.active[0]._index
    
    console.log('id_ ', this.chartIdLabelsIB[index], this.chartLabelsIB[index])

    console.log(this.detalheCampanhaStatus)

  }

  public chartHoveredIB(e: any): void {
    
    //console.log('Hoveerded', e)

   }





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
    private toastrService: ToastService,
    private randomColor: RandomColor,
    private elementRef: ElementRef, ) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.route.params.subscribe(res => {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
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

  getObservacao(i) {
    if (i.tipo_pergunta === 4) {
      return this.transformData(i.observacao);
    }
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
    return retorno.resposta.filter(resp => {
      const respTime = new Date(resp.dt_resposta).getTime();
      const dt_inicial = moment(
        this.dataInicial.split('/')[2] + '/' +
        this.dataInicial.split('/')[1] + '/' +
        this.dataInicial.split('/')[0]
      ).startOf('day').toDate().getTime();
      const dt_final = moment(
        this.dataFinal.split('/')[2] + '/' +
        this.dataFinal.split('/')[1] + '/' +
        this.dataFinal.split('/')[0]
      ).endOf('day').toDate().getTime();
      return respTime >= dt_inicial && respTime <= dt_final;
    });
  }

  async onSelectedChange(a: any) {
    if (a.length) {
      const ret = await this.getRespAnalitico(a);
      if (ret[0].cliente && ret[0].dt_resposta) {
        this.questRespAnalitica = ret;
      }
    } else {
      this.questRespAnalitica = [];
    }
  }

  onFilterChange(a: any) {
    console.log(a);
  
  }

  povoaAlternativas(id_pergunta: any) {
    const alternativa = this.questRespSintetica.filter((r) => {
      if (r.id_pergunta === id_pergunta && r.id_alternativa != null) { return true; }
    }).map((c: any) => {
      this.alternativasPeguntas.push(c)
      return {
        // text: `${c.alternativa} = ${c.tot_resp}` + (c.proxima_pergunta ? ' -> Próxima pergunta: ' + c.proxima_pergunta : ''),
        text: `${c.alternativa}` + (c.proxima_pergunta ? ' -> Próx. Perg: ' + c.proxima_pergunta : ''),
        value: c.id_alternativa,
        collapsed: true,
        checked: false,
        children: []
      };
    });
    return alternativa;
  }

  povoaPerguntas(id_questionario: any) {
    const perguntas = [];
    this.perguntasQuest = [];
    this.alternativasPeguntas = [];
    this.questRespSintetica.forEach((item) => {
      const index = perguntas.findIndex(redItem => {
        return item.id_pergunta === redItem.id_pergunta;
      });
      if (index > -1) {
        // perguntas[index].tot_resp = perguntas[index].tot_resp + item.tot_resp;
        perguntas[index].tot_resp = perguntas[index].tot_resp;
      } else {
        perguntas.push(item);
        this.perguntasQuest.push(item);
      }
    });
    return perguntas.map((item) => {
      return {
        // text: `${item.pergunta}  ${item.tipo_pergunta > 2 ? ' = ' + item.tot_resp : ''}`,
        text: `${item.pergunta}`,
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


  exportaAnalitico() {
    if (this.questRespAnalitica.length) {
      const content = this.questRespAnalitica.map(q => {
        return {
          cliente: q.cliente,
          data: this.transformData(q.dt_resposta),
          usuario: q.usuario,
          pergunda: q.pergunda,
          alternativa: q.alternativa,
          observacao: q.observacao,
        };
      });
      new Angular5Csv(content, 'data-table', {
        fieldSeparator: ';',
        headers: ['Cliente', 'Data Resposta', 'Usuário', 'Pergunta', 'Alternativa', 'Observação'],
        // type: 'text/csv;charset=utf-8;'
      });
    }
  }

  dadosParaGrafico(dados: any, titulo: string){
    this.titulo = titulo;
    this.chartLabelsIB = [];
    this.chartIdLabelsIB = [];
    this.chartDatasetsIB[0].data = [];
    this.chartDatasetsIB[0].label = titulo;
    this.chartColorsIB[0].backgroundColor = [];
    this.chartColorsIB[0].hoverBackgroundColor = [];
    this.chartColorsIB[0].borderWidth = 2 ;
    dados.forEach(element => {
      this.chartLabelsIB.push(element.status_ligacao);
      this.chartIdLabelsIB.push(element.id_resp_motivo);
      this.chartDatasetsIB[0].data.push(element.total);
      let rgb_rgba = this.randomColor.getRandomColorRGBeRGBA()
      this.chartColorsIB[0].backgroundColor.push(`${rgb_rgba.rgba}`);
      this.chartColorsIB[0].hoverBackgroundColor.push(`${rgb_rgba.rgb}`);
     }); 
  };

  gerarPDF(objeto: any){

    var imagDoc: any;
    html2canvas(document.getElementById(objeto)).then( function (canvas) {
           imagDoc = canvas.toDataURL("image/png");
           var docDefinition = {
            pageSize: 'A4',
            pageMargins: [10, 10, 5, 5],
            content: [
              {
                image: imagDoc,
                width: 500
              }],
          };
          pdfMake.createPdf(docDefinition).open()
    });
  };
  
  fecharFormularioGraficoResposta(){
    this.formularioGraficoResposta = false;
  }


  povoaVetoresGraficoPerguntas(){
    debugger;

    let baseConfig_: Chart.ChartConfiguration;

    this.formularioGraficoResposta = true;
    this.charts = [];
    this.chartData = [];
    this.optionsBar = [];
    let labels: Array<any> = [];
    let datasets: Array<any> = [];
    let regAltFiltr: Array<any> = [];
    let dataReg: Array<number> = [];
    let label: string;
    let backgroundColor: Array<any> = [];
    let borderColor: Array<any> = [];
    let totRespPergunta: number;

    this.perguntasQuest.forEach((elemPerg ) => {
      
      regAltFiltr = [];
      dataReg = [];
      label = '';
      backgroundColor = [];
      borderColor = [];
      labels = [];
      datasets = [];
      totRespPergunta = 0;

      // filtra as alternativas da pergunta 
      this.alternativasPeguntas.forEach(elemAlt => {
          if (elemPerg.id_pergunta == elemAlt.id_pergunta) {
            regAltFiltr.push(elemAlt);
          } 
      });
      // pova vetores das alternativas da pergunta 
      regAltFiltr.forEach( elem => {
        labels.push(elem.alternativa);
        dataReg.push(elem.tot_resp);
        totRespPergunta += elem.tot_resp;
        let rgb_rgba = this.randomColor.getRandomColorRGBeRGBA()
        backgroundColor.push(`${rgb_rgba.rgba}`);
        borderColor.push(`${rgb_rgba.rgb}`);
      })
      // se o tipo da pergunda for 3 e 4 
      if (elemPerg.tipo_pergunta > 2){
        labels.push('Dados informados');
        dataReg.push(elemPerg.tot_resp);
        totRespPergunta += elemPerg.tot_resp;
        let rgb_rgba = this.randomColor.getRandomColorRGBeRGBA()
        backgroundColor.push(`${rgb_rgba.rgba}`);
        borderColor.push(`${rgb_rgba.rgb}`);
      }
      // monta datasets da pergunta 
      datasets.push({
        data: dataReg,
        backgroundColor: backgroundColor,
        borderColor:  borderColor,
        borderWidth: 1,
      })
      
      this.optionsBar.push({
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false },
          scales: {
            xAxes: [{ display: true }],
            yAxes: [{ display: true ,
              ticks: {
                beginAtZero: true
            }}],
          },
          title: {
            display: true,
            text: `${elemPerg.pergunta} => total de respostas: ${totRespPergunta}`,
            padding: 20,
            fontSize: 14, 
            fontFamily: 'Arial' 
        },
        
      });

      this.chartData.push({
        labels: labels,
        datasets: datasets,
      })
    
      baseConfig = baseConfig_;

    });
  }

    montaGraficosPerguntas(){

      this.formularioGraficoResposta = true;

      this.charts = this.chartElementRefs.map((chartElementRef, index) => {
        const config = Object.assign({}, { type: "bar", options: this.optionsBar[index], data: this.chartData[index] });
        return new Chart(chartElementRef.nativeElement, config);
      });
    }

   
}
