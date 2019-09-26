import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { ToastService, InputsModule } from '../../lib/ng-uikit-pro-standard';
import { Usuario } from '../login/usuario';
import { LocalStorage } from '../shared/services/localStorage';

class Perg {
  alternativas: [{
    id: null,
    id_pergunta: null,
    id_proxima_pergunta: null,
    nome: null,
    sequencia_alternativa: null,
    exige_observacao: null,
    status: null,
  }];
  tipo_pergunta: null;
  descricao_pergunta: null;
  id: null;
  id_questionario: null;
  multipla_escolha: null;
  nome: null;
  sequencia_pergunta: null;
  status: null;
  id_proxima_pergunta: null;
}

@Component({
  selector: 'app-responder-questionario',
  templateUrl: './responder-questionario.component.html',
  styleUrls: ['./responder-questionario.component.scss']
})
export class ResponderQuestionarioComponent implements OnInit, OnDestroy {
  @Input() questId = null;
  @Input() eventoId = null;
  @Input() receptorId = null;
  @Output() callback = new EventEmitter();
  questionario: any = {};
  respondendo = false;
  msg = '';
  perguntaAtual = {
    alternativas: [{
      id: null,
      id_pergunta: null,
      id_proxima_pergunta: null,
      nome: null,
      sequencia_alternativa: null,
      status: null,
      exige_observacao: null
    }],
    tipo_pergunta: null,
    descricao_pergunta: null,
    id: null,
    id_questionario: null,
    multipla_escolha: null,
    nome: null,
    sequencia_pergunta: null,
    status: null,
    id_proxima_pergunta: null,
  };
  multiEscolha = false;
  alternativaEscolhida = null;
  respostaEscrita = '';
  concluiu = false;
  usuarioLogado: Usuario;
  alternativasEscolhidas = [];
  constructor(
    private connectHTTP: ConnectHTTP,
    private toastrService: ToastService,
    private localStorage: LocalStorage) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
  }

  ngOnInit() {
    if (this.questId)
      this.getDataQuestionario();
  }

  ngOnDestroy() {
    this.reset();
  }

  responder() {
    this.respondendo = true;
    this.perguntaAtual = this.questionario.perguntas.find(p => p['sequencia_pergunta'] === 1);
    this.montaPergunta();
  }

  montaPergunta() {
    this.limpaPergunta();
    this.multiEscolha = this.perguntaAtual.tipo_pergunta == 2;
    this.setaPergunta(this.perguntaAtual.nome);
    if (this.perguntaAtual.tipo_pergunta === 3) {
      this.criaRespostaNormal();
    }
    else if (this.perguntaAtual.tipo_pergunta === 4) {
      this.criaRespostaTipoData();
    }
    else if (this.perguntaAtual.tipo_pergunta == 1 || this.perguntaAtual.tipo_pergunta == 2) {
      this.perguntaAtual.alternativas.forEach(alt => {
        let divPai = document.createElement('div');
        divPai.className = 'col-lg-12 quest-response mb-3';
        const input = (this.perguntaAtual.tipo_pergunta == 2) ? this.criaAlternativaMultiEscolha(alt.nome, alt.id) : this.criaAlternativaMultiplaEscolha(alt.nome, alt.id);
        divPai.appendChild(input);
        let span = document.createElement('label');
        span.textContent = alt.nome;
        span.className = 'quest-response-text';
        span.setAttribute('for', alt.id);
        divPai.appendChild(span);
        const resposta = document.querySelector(".quest-container");
        resposta.appendChild(divPai)
        // if (alt.exige_observacao) {
        //   this.criaRespostaNormal(alt.exige_observacao);
        // }
      });
    }
  }

  limpaPergunta() {
    this.respostaEscrita = '';
    this.alternativaEscolhida = null;
    this.multiEscolha = null;
    let list = document.querySelector(".quest-container");
    while (list.hasChildNodes()) {
      list.removeChild(list.firstChild);
    }
  }

  setaPergunta(text) {
    const pergunta = document.querySelector("#questpergunta");
    pergunta.textContent = text;
  }

  criaAlternativaMultiplaEscolha(text, id) {
    let input = document.createElement('input');
    input.type = "radio";
    input.id = id;
    input.className = 'quest-response-input';
    input.name = "alternativa";
    input.value = id;
    input.onclick = (event) => {
      const id = event.target['value'];
      const alt = this.getAlternativa(id)
      if (alt.exige_observacao) {
        this.criaRespostaNormal(alt.exige_observacao);
      }
      else {
        const campo = document.querySelector('.quest-observacao');
        if (campo)
          document.querySelector(".quest-container").removeChild(campo);
      }
      this.alternativaEscolhida = event.target['value'];
    };
    return input;
  }

  criaAlternativaMultiEscolha(text, id) {
    let input = document.createElement('input');
    input.type = "checkbox";
    input.id = id;
    input.className = 'quest-response-input';
    input.name = "alternativa";
    input.value = id;
    input.onchange = (event) => {
      if (event.target['checked']) {
        if (!this.alternativasEscolhidas.length)
          return this.alternativasEscolhidas.push(event.target['value']);
        if (this.alternativasEscolhidas.some(a => a != event.target['value']))
          return this.alternativasEscolhidas.push(event.target['value']);
      }
      this.alternativasEscolhidas.forEach((a, index) => {
        if (a == event.target['value'])
          this.alternativasEscolhidas.splice(index, 1);
      });
    };
    return input;
  }

  criaRespostaNormal(exige_observacao = false) {
    let divPai = document.createElement('div');
    divPai.className = 'col-lg-12 quest-observacao mb-3';

    let textarea = document.createElement('textarea');
    textarea.id = "alternativa";
    textarea.className = 'quest-response-textarea';
    textarea.onkeypress = (event) => {
      this.respostaEscrita = event.target['value'];
    };
    if (exige_observacao) {
      let span = document.createElement('label');
      span.textContent = 'Observação (Campo Obrigatório)';
      span.className = 'ml-0 mb-3';
      divPai.appendChild(span);
    }
    const reposta = document.querySelector(".quest-container");
    divPai.appendChild(textarea);
    reposta.appendChild(divPai);
  }

  criaRespostaTipoData(exige_observacao = false) {
    let divPai = document.createElement('div');
    divPai.className = 'col-lg-12 quest-observacao mb-3';

    let input_date = document.createElement('input');
    input_date.id = "alternativa_data";
    input_date.type = "date";
    input_date.className = 'quest-response-input';
    input_date.onkeypress = (event) => {
      this.respostaEscrita = event.target['value'];
    };
    if (exige_observacao) {
      let span = document.createElement('label');
      span.textContent = 'Observação (Campo Obrigatório)';
      span.className = 'ml-0 mb-3';
      divPai.appendChild(span);
    }
    const reposta = document.querySelector(".quest-container");
    divPai.appendChild(input_date);
    reposta.appendChild(divPai);
  }

  getAlternativa(id) {
    return this.perguntaAtual.alternativas.find(alt => {
      return alt.id === parseInt(id);
    });
  }

  proxPergunta() {
    console.log(this.perguntaAtual)
    let self = this;
    if (!this.alternativaEscolhida && !this.alternativasEscolhidas && !this.respostaEscrita) {
      return alert('Precisa informar um reposta para poder prosseguir!');
    }
    let alternativa = [];
    if (this.perguntaAtual.tipo_pergunta == 1) {
      const alt = this.getAlternativa(this.alternativaEscolhida);
      if (alt.exige_observacao && !this.respostaEscrita) {
        return alert('Precisa acrescentar uma observação nesta alternativa!');
      }
      else if (!alt.exige_observacao) this.respostaEscrita = '';
    }
    let proxPerg: Perg;
    try {
      if (this.perguntaAtual.tipo_pergunta == 1) {
        this.alternativaEscolhida = this.perguntaAtual.alternativas.find(alt => {
          return alt.id === parseInt(this.alternativaEscolhida);
        });
        salvaResp(this.alternativaEscolhida);
        proxPerg = this.questionario.perguntas.find(p => p.id == this.alternativaEscolhida.id_proxima_pergunta)
      }
      else {
      proxPerg = this.questionario.perguntas.find(p => p.id == this.perguntaAtual.id_proxima_pergunta);
      if (this.perguntaAtual.tipo_pergunta == 2) {
        this.alternativasEscolhidas = this.perguntaAtual.alternativas.filter(alt => {
          return this.alternativasEscolhidas.some(ac => ac == alt.id)
        });
        this.alternativasEscolhidas.forEach(a => {
          salvaResp(a);
        })
      }
      else {
        salvaResp();
        }
      };
      // if (!proxPerg || this.multiEscolha)
      //   proxPerg = this.questionario.perguntas.find(p => p.sequencia_pergunta == (this.perguntaAtual.sequencia_pergunta + 1));
      // if (proxPerg && proxPerg.tipo_pergunta != 3 && !proxPerg['alternativas'][0].id_proxima_pergunta && !proxPerg['alternativas'][0].nome) {
      //   proxPerg = this.questionario.perguntas.find(p => {
      //     return (p.sequencia_pergunta >= (this.perguntaAtual.sequencia_pergunta + 1) && p.alternativas[0].id_proxima_pergunta && p.alternativas[0].nome)
      //   });
      // }
      if (!proxPerg) {
        return this.terminou();
      }
      this.perguntaAtual = proxPerg;
      this.montaPergunta();

    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes resp', e);
    }

    async function salvaResp(a = null) {
      let objResp = {
        id_alternativa: a ? a.id : null,
        id_usuario: self.usuarioLogado.id,
        id_receptor: self.receptorId,
        observacao: (self.respostaEscrita || ''),
        id_evento: self.eventoId,
        id_pergunta: self.perguntaAtual.id
      }
      let gravarResposta = await self.connectHTTP.callService({
        service: 'gravaRespostaQuestionario',
        paramsService: { data: JSON.stringify(objResp) }
      }) as any;
      if (gravarResposta.error) {
        return self.toastrService.error(gravarResposta.error);
      }
    }
  }

  terminou(msg = 'Questionário respondido com sucesso!') {
    this.respondendo = false;
    this.perguntaAtual = null;
    this.multiEscolha = null;
    this.alternativaEscolhida = null;
    this.alternativasEscolhidas = [];
    this.respostaEscrita = '';
    this.concluiu = true;
    this.msg = msg;
    this.toastrService.success(msg);
    this.callback.emit();
  }

  encerrar() {
    this.terminou('Questionário encerrado, reponda novamente no futuro!');
    this.toastrService.warning('Questionário encerrado, reponda novamente no futuro!');
  }

  async getDataQuestionario() {
    try {
      let respQuest = await this.connectHTTP.callService({
        service: 'getQuestionarioCompletoById',
        paramsService: { id: this.questId }
      }) as any;
      let data = {
        id: respQuest.resposta[0].id_questionario,
        nome: respQuest.resposta[0].nome_questionario,
        perguntas: []
      };
      respQuest.resposta.forEach(perg => {
        if (!data.perguntas.some(p => p.id === perg.id_pergunta)) {
          data.perguntas.push({
            id: perg.id_pergunta,
            multipla_escolha: perg.multipla_escolha,
            nome: perg.pergunda,
            tipo_pergunta: perg.tipo_pergunta,
            sequencia_pergunta: perg.sequencia_pergunta,
            id_proxima_pergunta: perg.id_proxima_pergunta,
            alternativas: (respQuest.resposta.filter(alt => alt.id_pergunta === perg.id_pergunta).map(alt => {
              return {
                id: alt.id_alternativa,
                id_pergunta: alt.id_pergunta,
                id_proxima_pergunta: alt.id_proxima_pergunta,
                nome: alt.alternativa,
                exige_observacao: alt.exige_observacao,
                sequencia_alternativa: alt.sequencia_alternativa
              }
            }))
          })
        }
      });
      this.questionario = data;
      this.responder();
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes resp', e);
    }
  }

  reset() {
    this.questionario = {};
    this.respondendo = false;
    this.msg = '';
    this.perguntaAtual = {
      alternativas: [{
        id: null,
        id_pergunta: null,
        id_proxima_pergunta: null,
        nome: null,
        sequencia_alternativa: null,
        exige_observacao: null,
        status: null,
      }],
      descricao_pergunta: null,
      tipo_pergunta: null,
      id: null,
      id_questionario: null,
      multipla_escolha: null,
      nome: null,
      sequencia_pergunta: null,
      status: null,
      id_proxima_pergunta: null,
    };
    this.multiEscolha = false;
    this.alternativaEscolhida = null;
    this.respostaEscrita = '';
    this.concluiu = false;
  }
}
