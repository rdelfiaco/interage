import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-formulario-evento',
  templateUrl: './formulario-evento.component.html',
  styleUrls: ['./formulario-evento.component.scss']
})
export class FormularioEventoComponent implements OnInit {

  @Input() evento: any;
  eventoForm: FormGroup;
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
  }

  ngOnChanges() {
    this.eventoForm.setValue({
      id: this.evento.id,
      status: this.evento.status,
      motivo: this.evento.motivo,
      dt_criou: this.evento.dt_criou ? moment(this.evento.dt_criou).format('DD/MM/YYYY hh:mm:ss') : this.evento.dt_criou,
      dt_para_exibir: this.evento.dt_para_exibir ? moment(this.evento.dt_para_exibir).format('DD/MM/YYYY hh:mm:ss') : this.evento.dt_para_exibir,
      dt_prevista_resolucao: this.evento.dt_prevista_resolucao ? moment(this.evento.dt_prevista_resolucao).format('DD/MM/YYYY hh:mm:ss') : this.evento.dt_prevista_resolucao,
      pessoa_criou: this.evento.pessoa_criou,
      destino: this.evento.destino,
      cliente: this.evento.cliente,
      telefone: this.evento.telefone,
      objecao: this.evento.objecao,
      resposta_motivo: this.evento.resposta_motivo,
      predicao: this.evento.predicao,
      pessoa_visualizou: this.evento.pessoa_visualizou,
      pessoa_resolveu: this.evento.pessoa_resolveu,
      dt_visualizou: this.evento.dt_visualizou ? moment(this.evento.dt_visualizou).format('DD/MM/YYYY hh:mm:ss') : this.evento.dt_visualizou,
      dt_resolvido: this.evento.dt_resolvido ? moment(this.evento.dt_resolvido).format('DD/MM/YYYY hh:mm:ss') : this.evento.dt_resolvido,
      observacao_origem: this.evento.observacao_origem,
      observacao_retorno: this.evento.observacao_retorno,
    });
  }

}
