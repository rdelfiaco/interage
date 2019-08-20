import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { ToastService, InputsModule } from '../../lib/ng-uikit-pro-standard';
import { Usuario } from '../login/usuario';
import { LocalStorage } from '../shared/services/localStorage';


@Component({
  selector: 'app-responder-questionario',
  templateUrl: './responder-questionario.component.html',
  styleUrls: ['./responder-questionario.component.scss']
})
export class ResponderQuestionarioComponent implements OnInit, OnDestroy {
  @Input() questId = null;
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
    if (this.multiEscolha) {
      this.perguntaAtual.alternativas.forEach(alt => {
        let divPai = document.createElement('div');
        divPai.className = 'col-lg-12 quest-response mb-3';
        const input = this.criaAlternativaMultiEscolha(alt.nome, alt.id);
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
    else {
      let divPai = document.createElement('div');
      divPai.className = 'col-lg-12 quest-response mb-3';
      const alternativa = this.criaRespostaNormal();
      divPai.appendChild(alternativa);
      const reposta = document.querySelector(".quest-container");
      reposta.appendChild(divPai);
    }
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

  criaAlternativaMultiEscolha(text, id) {
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
    if ((this.multiEscolha && !this.alternativaEscolhida) || (!this.multiEscolha && !this.respostaEscrita)) {
      return alert('Precisa informar um reposta para poder prosseguir!');
    }
    if (!this.alternativaEscolhida && (!this.multiEscolha && this.respostaEscrita))
      this.alternativaEscolhida = this.perguntaAtual.alternativas[0];
    else
      this.alternativaEscolhida = this.perguntaAtual.alternativas.find(alt => {
        return alt.id === parseInt(this.alternativaEscolhida);
      });

    try {
      let objResp = {
        id_alternativa: this.alternativaEscolhida.id,
        id_usuario: this.usuarioLogado.id,
        id_receptor: null,
        dt_resposta: new Date(),
        observacao:(this.multiEscolha ? '' : this.respostaEscrita), 
        id_evento: this.perguntaAtual.id,
      }
      let gravarResposta = await this.connectHTTP.callService({
        service: 'gravaRespostaQuestionario',
        paramsService: { data:objResp}
      }) as any;
      if (gravarResposta.error) {
        return this.toastrService.error(gravarResposta.error);
      }
      let proxPerg = (this.questionario.perguntas.find(p => p.id == this.alternativaEscolhida.id_proxima_pergunta) || this.questionario.perguntas.find(p => p.id == (this.perguntaAtual.sequencia_pergunta + 1)));
      if (proxPerg && !proxPerg.alternativas[0].id_proxima_pergunta && !proxPerg.alternativas[0].nome) {
        proxPerg = this.questionario.perguntas.find(p => {
          return (p.id >= (this.perguntaAtual.sequencia_pergunta + 1) && p.alternativas[0].id_proxima_pergunta && p.alternativas[0].nome)
        });
      }
      if (proxPerg) {
        this.perguntaAtual = proxPerg;
        return this.montaPergunta();
      }
      return this.terminou();
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes', e);
    }
  }

  terminou(msg = 'Questionário respondido com sucesso!') {
    this.respondendo = false;
    this.perguntaAtual = null;
    this.multiEscolha = null;
    this.alternativaEscolhida = null;
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
        service: 'getQuestionarioById',
        paramsService: { id: this.questId }
      }) as any;
      let respPergQuest = await this.connectHTTP.callService({
        service: 'getPerguntasByIdUqestionario',
        paramsService: { id: this.questId }
      }) as any;
      if (respQuest.error) {
        return this.toastrService.error(respQuest.error);
      }
      if (respPergQuest.error) {
        return this.toastrService.error(respPergQuest.error);
      }
      let data = respQuest.resposta[0];
      data.perguntas = respPergQuest.resposta;
      for (let index = 0; index < data.perguntas.length; index++) {
        const element = data.perguntas[index];
        let respAlterQuest = await this.connectHTTP.callService({
          service: 'getAlternativasByIdPerguntas',
          paramsService: { id: element.id }
        }) as any;
        element.alternativas = respAlterQuest.resposta;
      }
      this.questionario = data;
      console.dir(this.questionario);
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes', e);
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
