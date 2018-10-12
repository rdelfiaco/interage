import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { Usuario } from '../login/usuario';
import { Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'telemarketing',
  templateUrl: './telemarketing.component.html',
  styleUrls: ['./telemarketing.component.scss']
})

export class TelemarketingComponent implements OnInit {
  usuarioLogado: any;
  campanhas: Observable<Array<object>>;
  campanhaSelecionada: any;
  campanhaIniciada: boolean;
  carregouEvento: boolean = false;
  evento: Observable<object>;
  eventoObject: any;
  pessoa: Observable<object>;
  observerPessoa: Subscriber<object>;
  observerEvento: Subscriber<object>;
  motivos_respostas: Observable<Array<object>>;
  predicoes: Observable<Array<object>>;
  formAberto: boolean;
  pessoaObject: any;
  pessoaNome: string;


  constructor(private connectHTTP: ConnectHTTP, private localStorage: LocalStorage, private dt: ChangeDetectorRef) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
  }

  async ngOnInit() {
    let campanha = await this.connectHTTP.callService({
      service: 'getCampanhasDoUsuario',
      paramsService: {
        token: this.usuarioLogado.token,
        id_usuario: this.usuarioLogado.id,
      }
    });
    this.campanhas = new Observable((observer) => {
      let camp = campanha.resposta as Array<object>
      camp = camp.map((c: any) => {
        return { value: c.id, label: c.nome }
      })
      observer.next(camp)
    })
  }

  getSelectedValue(campanhaSelecionada: any) {
    this.campanhaSelecionada = campanhaSelecionada
  }

  iniciarCampanha() {
    this.campanhaIniciada = true
  }

  pararCampanha() {
    this.campanhaIniciada = null
  }
  async solicitarLigacao() {
    var self = this;
    this.formAberto = true;
    let telemarketing = await this.connectHTTP.callService({
      service: 'getLigacaoTelemarketing',
      paramsService: {
        token: this.usuarioLogado.token,
        id_usuario: this.usuarioLogado.id,
        id_campanha: this.campanhaSelecionada.value,
        id_pessoa: this.usuarioLogado.id_pessoa,
        id_organograma: this.usuarioLogado.id_organograma
      }
    }) as any;

    this.eventoObject = telemarketing.resposta.evento;

    this.evento = new Observable((observer) => {
      observer.next(telemarketing.resposta.evento);
      self.carregouEvento = true;
    });
    this.pessoa = new Observable((observer) => {
      self.observerPessoa = observer;
      observer.next(telemarketing.resposta.pessoa)
      self.pessoaObject = telemarketing.resposta.pessoa;
    });

    this.motivos_respostas = telemarketing.resposta.motivos_respostas
    this.predicoes = telemarketing.resposta.predicoes
  }

  _limpar() {
    this.formAberto = false;
  }
  async refresh() {
    let pessoaId = this.pessoaObject.principal.id
    let pessoa = await this.connectHTTP.callService({
      service: 'getPessoa',
      paramsService: {
        token: this.usuarioLogado.token,
        id_usuario: this.usuarioLogado.id,
        id_pessoa: pessoaId
      }
    }) as any;
    this.pessoa = new Observable(o => o.next(pessoa.resposta));
  }
}
