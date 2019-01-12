import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { LocalStorage } from '../../shared/services/localStorage';
import { Usuario } from '../../login/usuario';
// import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { Router } from '@angular/router';
import { ModalDirective, ToastService } from '../../../lib/ng-uikit-pro-standard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-item-de-evento',
  templateUrl: './item-de-evento.component.html',
  styleUrls: ['./item-de-evento.component.scss']
})
export class ItemDeEventoComponent implements OnInit {
  podeConcluir: boolean;
  podeEncaminhar: boolean;
  concluirOuEncaminhar: string;

  encaminhar: boolean;
  concluir: boolean;
  carregando: boolean;
  podeVisualizarEvento: boolean;

  eventoSelecionado: any;
  eventoForm: FormGroup;
  usuarioLogado: any;
  usuarioLogadoSupervisor: any;
  tornarResponsavel: any;

  motivos_respostas: any;
  predicoes: any;
  objecoes: any;
  evento: any;
  eventoObject: any;
  pessoa: any;
  pessoaObject: any;

  @ViewChild('modalConcluirEvento') modalConcluirEvento: ModalDirective;
  @ViewChild('confirmSeTornarResponsavelModal') confirmSeTornarResponsavelModal: ModalDirective;
  @ViewChild('visualizarDetalhesEvento') visualizarDetalhesEvento: ModalDirective;

  @Input() eventos: any;
  constructor(private formBuilder: FormBuilder, private localStorage: LocalStorage,
    private connectHTTP: ConnectHTTP, private router: Router, private toastrService: ToastService) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.usuarioLogadoSupervisor = this.usuarioLogado.dashboard === "supervisor" || this.usuarioLogado.dashboard === "admin";
    this.eventoForm = this.formBuilder.group({
      id: [''],
      status: [''],
      motivo: [''],
      dt_criou: [''],
      dt_para_exibir: [''],
      dt_prevista_resolucao: [''],
      pessoa_criou: [''],
      destino: [''],
      cliente: [''],
      telefone: [''],
      objecao: [''],
      predicao: [''],
      resposta_motivo: [''],
      pessoa_visualizou: [''],
      pessoa_resolveu: [''],
      dt_visualizou: [''],
      dt_resolvido: [''],
      observacao_origem: [''],
      observacao_retorno: [''],
      id_proposta: ['']
    });
  }
  ngOnInit() {
    console.log(this.eventos)
  }

  async selecionaEvento(event, evento) {
    event.preventDefault();
    event.stopPropagation();
    this.carregando = true;
    this.eventoSelecionado = evento;

    let eventoEncontrado = await this.connectHTTP.callService({
      service: 'getEventoPorId',
      paramsService: {
        id_evento: evento.id
      }
    }) as any;

    this.motivos_respostas = eventoEncontrado.resposta.motivos_respostas;
    this.predicoes = eventoEncontrado.resposta.predicoes;
    this.objecoes = eventoEncontrado.resposta.objecoes;
    this.evento = new Observable(o => {
      o.next(eventoEncontrado.resposta.evento)
    });
    evento = eventoEncontrado.resposta.evento;
    this.eventoSelecionado = eventoEncontrado.resposta.evento;
    this.eventoObject = eventoEncontrado.resposta.evento;
    this.pessoa = new Observable(o => o.next(eventoEncontrado.resposta.pessoa));
    this.pessoaObject = eventoEncontrado.resposta.pessoa;


    this.eventoForm = this.formBuilder.group({
      id: [evento.id],
      status: [evento.status],
      motivo: [evento.motivo],
      dt_criou: [evento.dt_criou ? moment(evento.dt_criou).format('DD/MM/YYYY HH:mm:ss') : evento.dt_criou],
      dt_para_exibir: [evento.dt_para_exibir ? moment(evento.dt_para_exibir).format('DD/MM/YYYY HH:mm:ss') : evento.dt_para_exibir],
      dt_prevista_resolucao: [evento.dt_prevista_resolucao ? moment(evento.dt_prevista_resolucao).format('DD/MM/YYYY HH:mm:ss') : evento.dt_prevista_resolucao],
      pessoa_criou: [evento.pessoa_criou],
      destino: [evento.destino],
      cliente: [evento.cliente],
      telefone: [evento.telefone],
      objecao: [evento.objecao],
      resposta_motivo: [evento.resposta_motivo],
      predicao: [evento.predicao],
      pessoa_visualizou: [evento.pessoa_visualizou],
      pessoa_resolveu: [evento.pessoa_resolveu],
      dt_visualizou: [evento.dt_visualizou ? moment(evento.dt_visualizou).format('DD/MM/YYYY HH:mm:ss') : evento.dt_visualizou],
      dt_resolvido: [evento.dt_resolvido ? moment(evento.dt_resolvido).format('DD/MM/YYYY HH:mm:ss') : evento.dt_resolvido],
      observacao_origem: [evento.observacao_origem],
      id_proposta: [evento.id_proposta],
      observacao_retorno: [evento.observacao_retorno],
    });

    
    const eventoParaPessoaLogada = (this.eventoSelecionado.tipodestino === "P" && this.usuarioLogado.id_pessoa === this.eventoSelecionado.id_pessoa_organograma);
    const eventoParaPessoaOrgonogramaLogadaQueVisualizou = (this.eventoSelecionado.tipodestino === "O" && this.usuarioLogado.id_organograma === this.eventoSelecionado.id_pessoa_organograma && this.eventoSelecionado.id_pessoa_visualizou == this.eventoSelecionado.id_pessoa);

    if (eventoParaPessoaLogada || eventoParaPessoaOrgonogramaLogadaQueVisualizou || this.usuarioLogadoSupervisor) {
      this.podeVisualizarEvento = true;
    }
    else {
      this.podeVisualizarEvento = false;
    }

    this.podeConcluir = !(this.eventoSelecionado.id_status_evento == 5 || this.eventoSelecionado.id_status_evento == 6)
    this.podeEncaminhar = !(this.eventoSelecionado.id_status_evento == 5 || this.eventoSelecionado.id_status_evento == 6)
    this.carregando = false;
  }

  async abreEvento(evento: any) {
    const pessoaQueResolvelOEvento = (this.usuarioLogado.id_pessoa === evento.id_pessoa_resolveu);
    const eventoParaPessoaLogada = (evento.tipodestino === "P" && this.usuarioLogado.id_pessoa === evento.id_pessoa_organograma);
    const eventoParaPessoaOrgonogramaLogada = (evento.tipodestino === "O" && this.usuarioLogado.id_organograma === evento.id_pessoa_organograma);

    if (evento.id_status_evento == 1 || evento.id_status_evento == 4) {
      if (eventoParaPessoaLogada) {
        await this.connectHTTP.callService({
          service: 'visualizarEvento',
          paramsService: {
            id_evento: evento.id,
            id_pessoa_visualizou: this.usuarioLogado.id_pessoa
          }
        }) as any;
        this.router.navigate([`/evento/${evento.id}`]);
      }
      else if (this.usuarioLogadoSupervisor || eventoParaPessoaOrgonogramaLogada) {
        this.tornarResponsavel = evento;
        this.confirmSeTornarResponsavelModal.show();
      }
      else
        this.toastrService.error("Você não pode visualizar esse evento!");
    }
    if (evento.id_status_evento == 5 || evento.id_status_evento == 6) {
      if (eventoParaPessoaLogada || this.usuarioLogadoSupervisor) this.router.navigate([`/evento/${evento.id}`]);
      else this.toastrService.error("Você não pode visualizar esse evento!");
    }
    if (evento.id_status_evento == 3 || evento.id_status_evento == 7) {
      if (pessoaQueResolvelOEvento || this.usuarioLogadoSupervisor) this.router.navigate([`/evento/${evento.id}`]);
      else this.toastrService.error("Você não pode visualizar esse evento!");
    }
  }

  async visualizarEvento(event) {
    if (this.usuarioLogadoSupervisor) {
      this.selecionaEvento(event, this.tornarResponsavel);
      this.visualizarDetalhesEvento.show();
      this.tornarResponsavel = null;
    }
    else this.toastrService.error("Você não tem permissão de visualizar esse evento!");
  }

  cancelaSeTornarResponsavel() {
    this.tornarResponsavel = null;
    this.toastrService.error("Você não assumiu a responsabilidade não tem permissão para visualizar");
  }

  async confirmaSeTornarResponsavel(event) {
    try {
      await this.connectHTTP.callService({
        service: 'visualizarEvento',
        paramsService: {
          id_evento: this.tornarResponsavel.id,
          id_pessoa_visualizou: this.usuarioLogado.id_pessoa
        }
      }) as any;
      var self = this;
      setTimeout(() => {
        self.tornarResponsavel = null;
      }, 100)
      this.selecionaEvento(event, this.tornarResponsavel);
      this.visualizarDetalhesEvento.show();
    }
    catch (e) {
      this.toastrService.error('Erro em visualizarEvento: ', e.error);
    }
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
    this.visualizarDetalhesEvento.hide();
    this.modalConcluirEvento.show();
  }

  fechaModal() {
    
    this.concluirOuEncaminhar = '';
    this.encaminhar = false;
    this.concluir = false;
    this.modalConcluirEvento.hide();
    this.selecionaEvento(event, this.eventoSelecionado)
    this.visualizarDetalhesEvento.show();
  }
}