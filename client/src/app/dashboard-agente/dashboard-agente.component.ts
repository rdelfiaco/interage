import { PropostasEnviadasComponent } from './../proposta/propostas-enviadas/propostas-enviadas.component';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { IMyOptions, ToastService } from '../../lib/ng-uikit-pro-standard';
import { Http } from '@angular/http';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { Valida } from '../shared/services/valida';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard-agente',
  templateUrl: './dashboard-agente.component.html',
  styleUrls: ['./dashboard-agente.component.scss']
})
export class DashboardAgenteComponent implements OnInit {
  usuarioLogado: any;
  agentesVendasSelect: Array<any>;
  agentesVendasSelectValue:  string;
  agentesVendasSelectNome: string = 'Agente de vendas';
  //agentesVendasSelectNomeTemp: string;
  

  dataInicial: string = moment().startOf('month').format('DD/MM/YYYY');
  dataFinal: string = moment().endOf('month').format('DD/MM/YYYY');

  propostas: Array<any> = [];
  propostaTodos: Array<any> = [];
  propostaIndividual: Array<any> = [];

  eventos: Array<any> = [];
  eventoTodos: Array<any> = [];
  eventoIndividual: Array<any> = [];
  eventosChart: any;
  propostaChart: any;

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

  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    useBom: true,
    headers: ['Post ID', 'Post title', 'Post body']
  };


graficoProposta(){

  var ctx = document.getElementById("propostaChart");
  this.propostaChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ['Negociando', 'Recusadas', 'Canceladas', 'Tramitando', 'Ativas'],
          datasets: [{
              label: 'Altis',
              data: [
                     Number(this.propostaTodos[0].negociando),
                     Number(this.propostaTodos[0].recusadas),
                     Number(this.propostaTodos[0].canceladas),
                     Number(this.propostaTodos[0].tramitando),
                     Number(this.propostaTodos[0].ativas)
                    ],
              backgroundColor: [
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 159, 64, 0.2)'                
              ],
              borderColor: [
                'rgba(255, 159, 64, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(255, 159, 64, 0.8)' 
              ],
              borderWidth: 2
          },{
            label: this.agentesVendasSelectNome,
            data: [
              Number(this.propostaIndividual[0].negociando),
              Number(this.propostaIndividual[0].recusadas),
              Number(this.propostaIndividual[0].canceladas),
              Number(this.propostaIndividual[0].tramitando),
              Number(this.propostaIndividual[0].ativas)
             ],
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(75, 192, 192, 0.8)',
            ],
            borderWidth: 2
        },

        ]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });

}

graficoEventos(){
  var ctx = document.getElementById("eventosChart");

 

  this.eventosChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ['Destinados', 'Pendentes', 'Concluidos', 'Conc.Expirados', 'Encaminhados' ],
          datasets: [{
              label: 'Altis',
              data: [
                     Number(this.eventoTodos[0].destinados),
                     Number(this.eventoTodos[0].pendentes),
                     Number(this.eventoTodos[0].concluidos),
                     Number(this.eventoTodos[0].concluidos_expirados),
                     Number(this.eventoTodos[0].encaminhados)
                    ],
              backgroundColor: [
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 159, 64, 0.2)'                
              ],
              borderColor: [
                'rgba(255, 159, 64, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(255, 159, 64, 0.8)' 
              ],
              borderWidth: 2
          },{
            label: this.agentesVendasSelectNome,
            data: [
              Number(this.eventoIndividual[0].destinados),
              Number(this.eventoIndividual[0].pendentes),
              Number(this.eventoIndividual[0].concluidos),
              Number(this.eventoIndividual[0].concluidos_expirados),
              Number(this.eventoIndividual[0].encaminhados)
             ],
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(75, 192, 192, 0.8)',
            ],
            borderWidth: 2
        },

        ]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });
}

  constructor(
              private http: Http, 
              private connectHTTP: ConnectHTTP, 
              private localStorage: LocalStorage,
              private toastrService: ToastService, 
              private valida: Valida 
              ) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;
  }
  

  async ngOnInit() {
    let agentesVendas = await this.connectHTTP.callService({
      service: 'getAgentesVendas',
      paramsService: {
        id_organograma: this.usuarioLogado.id_organograma,
      }
    }) as any;

    
    this.agentesVendasSelect = agentesVendas.resposta as Array<object>;
    this.agentesVendasSelect = this.agentesVendasSelect.map(agenteVenda => {
      return { value: agenteVenda.id_pessoa, label: agenteVenda.nome }
    });

    if (this.usuarioLogado.responsavel_membro == 'M') {
      let agenteSelecionado = agentesVendas.resposta.filter(a => a.id_pessoa == this.usuarioLogado.id_pessoa)[0];

      this.agentesVendasSelectNome = agenteSelecionado.nome;
      this.agentesVendasSelectValue = agenteSelecionado.id_pessoa;
    }
    else {
      this.agentesVendasSelectNome = this.agentesVendasSelect[0].label;
      this.agentesVendasSelectValue = this.agentesVendasSelect[0].value;
    }

    this.lerPropostas();
    this.lerEventos();

  };

  async lerPropostas(){

    let propostas_ = await this.connectHTTP.callService({
      service: 'getPropostasPorPeriodoSintetico',
      paramsService: {
        id_organograma: this.usuarioLogado.id_organograma,
        dataInicial: this.dataInicial,
        dataFinal: this.dataFinal
      }
    }) as any;

    this.propostas = propostas_.resposta;   

    this.propostaTodos = this.propostas.filter ( proposta => {
                          if (proposta.id_pessoa ==  '9999999')
                            return proposta
                        })

    if (this.propostaTodos.length < 1) {
      this.propostaTodos = [{
        negociando: 0 ,
        recusadas :0,
        canceladas :0,
        tramitando :0,
        ativas :0,
      }]
    }
    this.povoaPropostaIndividual(Number(this.agentesVendasSelectValue))

   
  }

  async lerEventos(){

    let eventos_ = await this.connectHTTP.callService({
      service: 'getEventosPorPeriodoSintetico',
      paramsService: {
        id_organograma: this.usuarioLogado.id_organograma,
        dataInicial: this.dataInicial,
        dataFinal: this.dataFinal
      }
    }) as any;

    this.eventos = eventos_.resposta;   
    this.eventoTodos = this.eventos.filter ( evento => {
                          if (evento.id_pessoa_organograma ==  '9999999')
                            return evento
                        })

    if (this.eventoTodos.length < 1) {
      this.eventoTodos = [{
        destinados: 0 ,
        pendentes :0,
        concluidos :0,
        concluidos_expirados :0,
        encaminhados :0,
      }]
    }
    this.povoaEventosIndividuais(Number(this.agentesVendasSelectValue))
  }



  setNomeAtendente(value) {
    this.agentesVendasSelectNome = value.label;
    this.povoaPropostaIndividual(value.value);
    this.povoaEventosIndividuais(value.value);
    if (this.propostaChart != undefined){ this.propostaChart.destroy() }
    this.graficoProposta();
    if (this.eventosChart != undefined){ this.eventosChart.destroy() }
    this.graficoEventos();

  };

  povoaPropostaIndividual(id_pessoa: number){

    this.propostaIndividual = this.propostas.filter ( proposta => {
      if (Number(proposta.id_pessoa) ==  id_pessoa)
        return proposta
    })
    if (this.propostaIndividual.length < 1) {
      this.propostaIndividual = [{
        negociando: 0 ,
        recusadas :0,
        canceladas :0,
        tramitando :0,
        ativas :0,
      }]
    }
    if (this.propostaChart != undefined){ this.propostaChart.destroy() }
    this.graficoProposta();

  };

  povoaEventosIndividuais(id_pessoa: number){

    this.eventoIndividual = this.eventos.filter ( eventos => {
      if (Number(eventos.id_pessoa_organograma) ==  id_pessoa)
        return eventos
    })
    if (this.eventoIndividual.length < 1) {
      this.eventoIndividual = [{
        destinados: 0 ,
        pendentes :0,
        concluidos :0,
        concluidos_expirados :0,
        encaminhados :0,
      }]
    }
    
    if (this.eventosChart != undefined){ this.eventosChart.destroy() }
    this.graficoEventos();

  };

  validaData(dataAlterada: string){
    var validacao = this.valida.dataIncialFinal( this.dataInicial,this.dataFinal)
    if (!validacao.resultado){
      this.toastrService.error(validacao.mensagem)
      if (dataAlterada == 'dtInicial' ){
        this.dataInicial = moment().startOf('month').format('DD/MM/YYYY');
      }else{
        this.dataFinal = moment().endOf('month').format('DD/MM/YYYY');
      }
    }
    this.lerPropostas();
    this.lerEventos();
  }


  }
 
