import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { Usuario } from '../login/usuario';
import { Observable, Subscriber } from 'rxjs';
import {  Router } from '@angular/router';
import { ModalDirective } from '../../lib/ng-uikit-pro-standard';

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
  tableData = [];
  @ViewChild('basicModal') basicModal: ModalDirective;

  constructor(private connectHTTP: ConnectHTTP, 
              private localStorage: LocalStorage, 
              private dt: ChangeDetectorRef,
              private router: Router) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    if (!this.metaPessoa.ligacoes_realizadas) this.metaPessoa.ligacoes_realizadas = 0;
  }

  closeModal() {
    this.basicModal.hide();
  }

  async ngOnInit() {
    let r = await this.connectHTTP.callService({
      service: 'getCampanhasDoUsuario',
      paramsService: {
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

    this.getFollowDoUsuario();
    this.metaPessoa = r.resposta.metaPessoa[0];
    if (!this.metaPessoa.ligacoes_realizadas) this.metaPessoa.ligacoes_realizadas = 0;
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


  async getFollowDoUsuario(){
    let follow = await this.connectHTTP.callService({
      service: 'getCampanhaFollowDoUsuario',
      paramsService: {
        id_organograma: this.usuarioLogado.id_organograma,
      }
    }) as any;
    if (follow.error) this.tableData = [];
    else this.tableData = follow.resposta as Array<object>;
  }

  closemodal(modal) {
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
        id_pessoa: pessoaId
      }
    }) as any;
    this.pessoa = new Observable(o => o.next(pessoa.resposta));
  }

  atualizaMeta(metaPessoa) {
    this.metaPessoa = metaPessoa;
  }

  showEventosCampanha(id: any, campanha:string){

    let idSql= 4; 
    let idRegistro = id;
    
    this.router.navigate([`/showTable/{"idSql":${idSql},"idRegistro":${idRegistro},"titulo": "Eventos da campanha: ${campanha} "}`]);

  }

}
