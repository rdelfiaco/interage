import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
    status: null,
  }];
  descricao_pergunta: null;
  id: null;
  id_questionario: null;
  multipla_escolha: null;
  nome: null;
  sequencia_pergunta: null;
  status: null;
}

@Component({
  selector: 'app-responder-questionario',
  templateUrl: './responder-questionario.component.html',
  styleUrls: ['./responder-questionario.component.scss']
})
export class ResponderQuestionarioComponent implements OnInit, OnDestroy {
  @Input() questId = null;
  @Input() eventoId = null;
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
    }],
    descricao_pergunta: null,
    id: null,
    id_questionario: null,
    multipla_escolha: null,
    nome: null,
    sequencia_pergunta: null,
    status: null,
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
    this.multiEscolha = this.perguntaAtual.multipla_escolha;
    this.setaPergunta(this.perguntaAtual.nome);
    debugger
    if (!this.perguntaAtual.alternativas.length) {
      let divPai = document.createElement('div');
      divPai.className = 'col-lg-12 quest-response mb-3';
      const alternativa = this.criaRespostaNormal();
      divPai.appendChild(alternativa);
      const reposta = document.querySelector(".quest-container");
      return reposta.appendChild(divPai);
    }
    this.perguntaAtual.alternativas.forEach(alt => {
      let divPai = document.createElement('div');
      divPai.className = 'col-lg-12 quest-response mb-3';
      const input = this.multiEscolha ? this.criaAlternativaMultiEscolha(alt.nome, alt.id) : this.criaAlternativaMultiplaEscolha(alt.nome, alt.id);
      divPai.appendChild(input);
      let span = document.createElement('label');
      span.textContent = alt.nome;
      span.className = 'quest-response-text';
      span.setAttribute('for', alt.id);
      divPai.appendChild(span);
      const resposta = document.querySelector(".quest-container");
      resposta.appendChild(divPai)
    });
  }

  limpaPergunta() {
    this.respostaEscrita = null;
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
      debugger
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

  criaRespostaNormal() {
    let textarea = document.createElement('textarea');
    textarea.id = "alternativa";
    textarea.className = 'quest-response-textarea';
    textarea.onkeypress = (event) => {
      this.respostaEscrita = event.target['value'];
    };
    return textarea;
  }

  async proxPergunta() {
    if (!this.alternativaEscolhida && !this.alternativasEscolhidas && !this.respostaEscrita) {
      return alert('Precisa informar um reposta para poder prosseguir!');
    }
    let alternativa = [];
    let proxPerg: Perg;
    try {
      if (this.alternativaEscolhida) {
        this.alternativaEscolhida = this.perguntaAtual.alternativas.find(alt => {
          return alt.id === parseInt(this.alternativaEscolhida);
        });
        salvaResp(this.alternativaEscolhida);
        proxPerg = this.questionario.perguntas.find(p => p.id == this.alternativaEscolhida.id_proxima_pergunta)
      }
      else if (this.alternativasEscolhidas.length) {
        this.alternativasEscolhidas = this.perguntaAtual.alternativas.filter(alt => {
          return this.alternativasEscolhidas.some(ac => ac == alt.id)
        });
        this.alternativasEscolhidas.forEach(a => {
          salvaResp(a);
        })
      }
      else salvaResp();
      if (!proxPerg)
        proxPerg = this.questionario.perguntas.find(p => p.id == (this.perguntaAtual.sequencia_pergunta + 1));
      if (proxPerg && !proxPerg['alternativas'][0].id_proxima_pergunta && !proxPerg['alternativas'][0].nome) {
        proxPerg = this.questionario.perguntas.find(p => {
          return (p.id >= (this.perguntaAtual.sequencia_pergunta + 1) && p.alternativas[0].id_proxima_pergunta && p.alternativas[0].nome)
        });
      }
      if (!proxPerg) {
        return this.terminou();
      }
      this.perguntaAtual = proxPerg;
      this.montaPergunta();

      async function salvaResp(a = null) {
        let objResp = {
          id_alternativa: a ? a.id : null,
          id_usuario: this.usuarioLogado.id,
          id_receptor: null,
          dt_resposta: new Date(),
          observacao: this.respostaEscrita,
          id_evento: this.eventoId,
        }
        let gravarResposta = await this.connectHTTP.callService({
          service: 'gravaRespostaQuestionario',
          paramsService: { data: JSON.stringify(objResp) }
        }) as any;
        if (gravarResposta.error) {
          return this.toastrService.error(gravarResposta.error);
        }
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes resp', e);
    }
  }

  terminou(msg = 'Questionário respondido com sucesso!') {
    this.respondendo = false;
    this.perguntaAtual = null;
    this.multiEscolha = null;
    this.alternativaEscolhida = null;
    this.alternativasEscolhidas = [];
    this.respostaEscrita = null;
    this.concluiu = true;
    this.msg = msg;
    this.toastrService.success(msg);
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
            sequencia_pergunta: perg.sequencia_pergunta,
            alternativas: (respQuest.resposta.filter(alt => alt.id_pergunta === perg.id_pergunta).map(alt => {
              return {
                id: alt.id_alternativa,
                id_pergunta: alt.id_pergunta,
                id_proxima_pergunta: alt.id_proxima_pergunta,
                nome: alt.alternativa,
                sequencia_alternativa: alt.sequencia_alternativa
              }
            }))
          })
        }
      });
      this.questionario = data;
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
        status: null,
      }],
      descricao_pergunta: null,
      id: null,
      id_questionario: null,
      multipla_escolha: null,
      nome: null,
      sequencia_pergunta: null,
      status: null,
    };
    this.multiEscolha = false;
    this.alternativaEscolhida = null;
    this.respostaEscrita = '';
    this.concluiu = false;
  }
}
