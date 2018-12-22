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
  metaPessoa: any = {};
  campanhas: Observable<Array<object>>;
  campanhaSelecionada: any;
  campanhaIniciada: boolean;
  carregouEvento: boolean = false;
  evento: Observable<object>;
  eventoObject: any;
  pessoa: Observable<object>;
  observerEvento: Subscriber<object>;
  motivos_respostas: Observable<Array<object>>;
  predicoes: Observable<Array<object>>;
  objecoes: Observable<Array<object>>;
  formAberto: boolean;
  carregouPessoa: boolean = false;
  pessoaObject: any;
  pessoaNome: string;
  velocimetro: string;

  constructor(private connectHTTP: ConnectHTTP, private localStorage: LocalStorage, private dt: ChangeDetectorRef) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
  }

  async ngOnInit() {
    let r = await this.connectHTTP.callService({
      service: 'getCampanhasDoUsuario',
      paramsService: {
        token: this.usuarioLogado.token,
        id_usuario: this.usuarioLogado.id,
        id_pessoa: this.usuarioLogado.id_pessoa,
      }
    }) as any;
    this.campanhas = new Observable((observer) => {
      let camp = r.resposta.campanhas as Array<object>
      camp = camp.map((c: any) => {
        return { value: c.id, label: c.nome }
      })
      observer.next(camp)
    })

    this.metaPessoa = r.resposta.metaPessoa[0];
    this._constroiGraficoMeta(this.metaPessoa);
  }

  _constroiGraficoMeta(meta) {
    let arr = [];

    arr.push('http://chart.apis.google.com/chart?')
    arr.push('chs=225x125')
    arr.push('&cht=gom')
    arr.push(`&chd=t:${meta.chd || 6}`)
    arr.push(`&chds=0,${meta.chds || 12}`)
    arr.push('&chco=ff0000,ffff00,00ff00')
    arr.push('&chxt=y')
    arr.push('&chxl=0:|0|100')
    this.velocimetro = arr.join('')
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
    debugger;
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
    if (telemarketing.error) {
      self.carregouEvento = true;
    }
    else {
      this.eventoObject = telemarketing.resposta.evento;

      this.evento = new Observable((observer) => {
        observer.next(telemarketing.resposta.evento);
        self.carregouEvento = true;
      });
      this.pessoa = new Observable((observer) => {
        observer.next(telemarketing.resposta.pessoa)
        setTimeout(() => {
          self.carregouPessoa = true;
        }, 0);
        self.pessoaObject = telemarketing.resposta.pessoa;
      });

      this.motivos_respostas = telemarketing.resposta.motivos_respostas
      this.predicoes = telemarketing.resposta.predicoes
      this.objecoes = telemarketing.resposta.objecoes
    }
  }

  _limpar() {
    this.formAberto = false;
    this.pessoa = null;
    this.evento = null;
    this.eventoObject = null;
    this.pessoaObject = null;
    this.pessoaNome = null;
    this.eventoObject = null;
    this.carregouEvento = false;
    this.carregouPessoa = false;
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

  atualizaMeta(metaPessoa) {
    this.metaPessoa = metaPessoa;
  }
}
