import { Component, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { Observable } from 'rxjs';
import { Usuario } from '../../login/usuario';
import { LocalStorage } from '../../shared/services/localStorage';
import { ModalDirective } from '../../../lib/ng-uikit-pro-standard';

@Component({
  selector: 'app-detalhe-evento',
  templateUrl: './detalhe-evento.component.html',
  styleUrls: ['./detalhe-evento.component.scss']
})
export class DetalheEventoComponent implements OnInit {
  id_evento: string;
  evento: any;
  motivos_respostas: any;
  predicoes: any;
  objecoes: any;
  carregando: boolean = false;
  pessoa: Observable<string[]>;
  eventoObject: any;
  pessoaObject: any;
  podeVisualizarEvento: boolean;
  usuarioLogadoSupervisor: boolean;
  usuarioLogado: Usuario;
  podeConcluir: boolean;
  podeEncaminhar: boolean;
  concluirOuEncaminhar: string;

  encaminhar: boolean;
  concluir: boolean;

  @ViewChild('modalConcluirEvento') modalConcluirEvento: ModalDirective;
  // @ViewChild('modalEncaminharEvento') modalEncaminharEvento: ModalDirective;
  @Input() idEvento: any
  @Input() soConcultar: boolean = false;

  constructor(private route: ActivatedRoute,
    private connectHTTP: ConnectHTTP, private localStorage: LocalStorage) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.usuarioLogadoSupervisor = this.usuarioLogado.dashboard === "supervisor" || this.usuarioLogado.dashboard === "admin";
    
    this.route.params.subscribe(res => {
      this.id_evento = res.id
    });

  }

  async ngOnInit() {
    this.carregaEvento();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.carregaEvento();
  }

  async carregaEvento() {
    if (this.idEvento){
      this.id_evento = this.idEvento
    }
    this.carregando = true;
    let eventoEncontrado = await this.connectHTTP.callService({
      service: 'getEventoPorId',
      paramsService: {
        id_evento: this.id_evento
      }
    }) as any;
    this.motivos_respostas = eventoEncontrado.resposta.motivos_respostas;
    this.predicoes = eventoEncontrado.resposta.predicoes;
    this.objecoes = eventoEncontrado.resposta.objecoes;
    this.evento = new Observable(o => o.next(eventoEncontrado.resposta.evento));
    this.eventoObject = eventoEncontrado.resposta.evento;
    this.pessoa = new Observable(o => o.next(eventoEncontrado.resposta.pessoa));
    this.pessoaObject = eventoEncontrado.resposta.pessoa;

    const eventoParaPessoaLogada = (this.eventoObject.tipodestino === "P" && this.usuarioLogado.id_pessoa === this.eventoObject.id_pessoa_organograma);
    const eventoParaPessoaOrgonogramaLogadaQueVisualizou = (this.eventoObject.tipodestino === "O" && this.usuarioLogado.id_organograma === this.eventoObject.id_pessoa_organograma && this.eventoObject.id_pessoa_visualizou == this.eventoObject.id_pessoa);
    const eventoQueVisualizei = (this.eventoObject.id_pessoa_visualizou == this.usuarioLogado.id_pessoa);

    const eventoPodeSerConcluidoEncaminhado = this.eventoObject.id_status_evento == 5 || this.eventoObject.id_status_evento == 6
    const podeConcluirEncaminhar = ((eventoParaPessoaLogada || eventoParaPessoaOrgonogramaLogadaQueVisualizou || eventoQueVisualizei) && eventoPodeSerConcluidoEncaminhado);
    
    this.podeConcluir = podeConcluirEncaminhar
    this.podeEncaminhar = podeConcluirEncaminhar
    this.carregando = false;
    this.carregando = false;
  }

  encaminharEvento() {
    this.concluirOuEncaminhar = "Encaminhar"
    this.encaminhar = true;
    this.concluir = false;
    this.mostrarModal();
  }

  concluirEvento() {
    this.concluirOuEncaminhar = "Concluir"
    this.encaminhar = false;
    this.concluir = true;
    this.mostrarModal();
  }

  mostrarModal() {
    this.modalConcluirEvento.show();
  }

  fechaModal() {
    this.concluirOuEncaminhar = '';
    this.encaminhar = false;
    this.concluir = false;
    this.modalConcluirEvento.hide();
    this.carregaEvento();
  }

  voltar() {
    if (this.idEvento){
      this.fechaModal()
    }else {
      history.back();
    }
  }

}
