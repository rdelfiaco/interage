import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-item-de-evento',
  templateUrl: './item-de-evento.component.html',
  styleUrls: ['./item-de-evento.component.scss']
})
export class ItemDeEventoComponent implements OnInit {

  eventoSelecionado: any;
  eventoForm: FormGroup;
  @Input() eventos: any;
  constructor(private formBuilder: FormBuilder) {
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
    });
  }

  ngOnInit() {
    console.log(this.eventos)
  }

  selecionaEvento(event, evento) {
    event.preventDefault();
    event.stopPropagation();
    this.eventoSelecionado = evento;
    this.eventoForm = this.formBuilder.group({
      id: [evento.id],
      status: [evento.status],
      motivo: [evento.motivo],
      dt_criou: [evento.dt_criou ? moment(evento.dt_criou).format('DD/MM/YYYY hh:mm:ss') : evento.dt_criou],
      dt_para_exibir: [evento.dt_para_exibir ? moment(evento.dt_para_exibir).format('DD/MM/YYYY hh:mm:ss') : evento.dt_para_exibir],
      dt_prevista_resolucao: [evento.dt_prevista_resolucao ? moment(evento.dt_prevista_resolucao).format('DD/MM/YYYY hh:mm:ss') : evento.dt_prevista_resolucao],
      pessoa_criou: [evento.pessoa_criou],
      destino: [evento.destino],
      cliente: [evento.cliente],
      telefone: [evento.telefone],
      objecao: [evento.objecao],
      resposta_motivo: [evento.resposta_motivo],
      predicao: [evento.predicao],
      pessoa_visualizou: [evento.pessoa_visualizou],
      pessoa_resolveu: [evento.pessoa_resolveu],
      dt_visualizou: [evento.dt_visualizou ? moment(evento.dt_visualizou).format('DD/MM/YYYY hh:mm:ss') : evento.dt_visualizou],
      dt_resolvido: [evento.dt_resolvido ? moment(evento.dt_resolvido).format('DD/MM/YYYY hh:mm:ss') : evento.dt_resolvido],
      observacao_origem: [evento.observacao_origem],
      observacao_retorno: [evento.observacao_retorno],
    });
  }
}


// {
//   "id": "6",
//   "id_evento_pai": null,
//   "id_evento_anterior": null,
//   "id_campanha": 5,
//   "campanha": "Prospecção",
//   "id_motivo": 1,
//   "motivo": "Prospecção",
//   "id_status_evento": 3,
//   "status": "CONCLUÍDO",
//   "status_evento_cor_texto": "text-success",
//   "status_evento_icone": "hourglass-end",
//   "id_pessoa_criou": "1",
//   "pessoa_criou": "Interage",
//   "dt_criou": "2018-09-26T03:00:00.000Z",
//   "dt_prevista_resolucao": "2018-10-03T03:00:00.000Z",
//   "dt_para_exibir": "2018-09-26T03:00:00.000Z",
//   "tipodestino": "O",
//   "id_pessoa_organograma": "4",
//   "destino": "Call Center",
//   "id_usuario": null,
//   "id_pessoa_receptor": "38",
//   "cliente": "Cliente 1",
//   "id_prioridade": 2,
//   "prioridade": "Normal",
//   "dt_visualizou": null,
//   "id_pessoa_visualizou": null,
//   "pessoa_visualizou": null,
//   "dt_resolvido": "2018-09-28T19:00:51.195Z",
//   "id_pessoa_resolveu": "4",
//   "pessoa_resolveu": "Atendente 3",
//   "exigi_aviso_leitura": "0",
//   "observacao_origem": "Ligar para vender o produto",
//   "observacao_retorno": "ola",
//   "id_resp_motivo": 6,
//   "resposta_motivo": "Não pode falar no momento",
//   "id_predicao": null,
//   "predicao": null,
//   "id_canal": 3,
//   "canal": "Ligação Ativa",
//   "id_telefone": 3,
//   "telefone": "(62) 998402546",
//   "complemento_resposta": null,
//   "tempo": "2 days 16:00:51.195784",
//   "eventosFilho": null
// }