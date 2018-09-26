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
  campanhas: Observable<Array<object>>;
  campanhaSelecionada: object;
  campanhaIniciada: boolean;
  ligacao: object;

  constructor(private connectHTTP: ConnectHTTP, private localStorage: LocalStorage) { }

  async ngOnInit() {
    let usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    let campanha = await this.connectHTTP.callService({
      service: 'getCampanhasDoUsuario',
      paramsService: {
        token: usuarioLogado.token
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
  solicitarLigacao() {
    this.ligacao = { pessoa: { nome: 'João' } }
  }
}
