import { Component, OnInit } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { Usuario } from '../login/usuario';
import { Observable } from 'rxjs';

@Component({
  selector: 'telemarketing',
  templateUrl: './telemarketing.component.html',
  styleUrls: ['./telemarketing.component.scss']
})
export class TelemarketingComponent implements OnInit {
  usuarioLogado: Usuario;
  campanhas: Observable<Array<object>>;
  campanhaSelecionada: object;
  campanhaIniciada: boolean;
  evento: Observable<object>;
  pessoa: Observable<object>;
  motivos_respostas: Observable<Array<object>>;
  formAberto: boolean;


  constructor(private connectHTTP: ConnectHTTP, private localStorage: LocalStorage) {
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
    let telemarketing = await this.connectHTTP.callService({
      service: 'getLigacaoTelemarketing',
      paramsService: {
        token: this.usuarioLogado.token,
        id_usuario: this.usuarioLogado.id,
        id_campanha: this.campanhaSelecionada.value
      }
    });
    this.evento = telemarketing.resposta.evento
    this.pessoa = telemarketing.resposta.pessoa
    this.motivos_respostas = telemarketing.resposta.motivos_respostas
    this.formAberto = true;
  }

  _limpar() {
    this.formAberto = false;
  }
}
