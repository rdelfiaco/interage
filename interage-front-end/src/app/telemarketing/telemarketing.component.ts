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

  constructor(private connectHTTP: ConnectHTTP, private localStorage: LocalStorage) { }
  
  async ngOnInit() {
    let usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    let campanha = await this.connectHTTP.callService({
      service: 'getCampanhasDoUsuario',
      paramsService: {
        token: usuarioLogado.token
      }
    });
    this.campanhas = campanha.resposta;
    debugger;
  }

}
