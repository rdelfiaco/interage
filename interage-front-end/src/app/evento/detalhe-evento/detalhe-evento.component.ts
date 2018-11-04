import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { Observable } from 'rxjs';
import { Usuario } from '../../login/usuario';
import { LocalStorage } from '../../shared/services/localStorage';

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
  podeVisualizarEvento: boolean;
  usuarioLogadoSupervisor: boolean;
  usuarioLogado: Usuario;

  constructor(private route: ActivatedRoute,
    private connectHTTP: ConnectHTTP, private localStorage: LocalStorage) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.usuarioLogadoSupervisor = this.usuarioLogado.dashboard === "supervisor" || this.usuarioLogado.dashboard === "admin";
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

    const eventoParaPessoaLogada = (this.evento.tipodestino === "P" && this.usuarioLogado.id_pessoa === this.evento.id_pessoa_organograma);
    const eventoParaPessoaOrgonogramaLogadaQueVisualizou = (this.evento.tipodestino === "O" && this.usuarioLogado.id_organograma === this.evento.id_pessoa_organograma && this.evento.id_pessoa_visualizou == this.usuarioLogado.id_pessoa);

    if (eventoParaPessoaLogada || eventoParaPessoaOrgonogramaLogadaQueVisualizou || this.usuarioLogadoSupervisor) {
      this.podeVisualizarEvento = true;
    }
    else {
      this.podeVisualizarEvento = false;
    }

    this.pessoa = new Observable(o => o.next(pessoa.resposta));
    this.carregando = false;
  }

}
