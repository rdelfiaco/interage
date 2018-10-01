import { Component, OnInit } from '@angular/core';
import { Usuario } from '../login/usuario';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.scss']
})
export class EventoComponent implements OnInit {
  usuarioLogado: Usuario;
  

  constructor(private connectHTTP: ConnectHTTP, private localStorage: LocalStorage) { 
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
  }

  async ngOnInit() {
    console.log( this.usuarioLogado )
    console.log(this.usuarioLogado.id_organograma)

    let eventos = await this.connectHTTP.callService({
      service: 'getEventosPendentes',
      paramsService: {
        token: this.usuarioLogado.token,
        id_usuario: this.usuarioLogado.id,        
        id_organograma: this.usuarioLogado.id_organograma,
      }
    });

    console.log(eventos.resposta )


  }
}

