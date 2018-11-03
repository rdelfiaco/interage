import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detalhe-evento',
  templateUrl: './detalhe-evento.component.html',
  styleUrls: ['./detalhe-evento.component.scss']
})
export class DetalheEventoComponent implements OnInit {
  id_evento: string;
  evento: any;
  carregando: boolean = false;
  pessoa: Observable<string[]>;

  constructor(private route: ActivatedRoute,
    private connectHTTP: ConnectHTTP) {
    this.route.params.subscribe(res => {
      this.id_evento = res.id
    });
  }

  async ngOnInit() {
    this.carregando = true;
    let eventoEncontrado = await this.connectHTTP.callService({
      service: 'getEventoPorId',
      paramsService: {
        id_evento: this.id_evento
      }
    }) as any;
    this.evento = eventoEncontrado.resposta[0];

    let pessoa = await this.connectHTTP.callService({
      service: 'getPessoa',
      paramsService: {
        id_pessoa: this.evento.id_pessoa_receptor
      }
    }) as any;
    this.pessoa = new Observable(o => o.next(pessoa.resposta));
    this.carregando = false;
  }

}
