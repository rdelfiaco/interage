import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ModalDirective } from '../../../lib/ng-uikit-pro-standard';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario-evento',
  templateUrl: './formulario-evento.component.html',
  styleUrls: ['./formulario-evento.component.scss']
})
export class FormularioEventoComponent implements OnInit {

  @Input() evento: any;
  @ViewChild('pessoaEditando') pessoaEditando: ModalDirective;
  eventoForm: FormGroup;
  pessoa: Observable<object>;
  constructor(private formBuilder: FormBuilder,
    private connectHTTP: ConnectHTTP,
    private router: Router) {
    this.eventoForm = this.formBuilder.group({
      id: [''],
      status: [''],
      motivo: [''],
      campanha: [''],
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


  }

  ngOnChanges() {
    this.eventoForm.setValue({
      id: this.evento.id,
      status: this.evento.status,
      motivo: this.evento.motivo,
      campanha: this.evento.campanha,
      dt_criou: this.evento.dt_criou ? moment(this.evento.dt_criou).format('DD/MM/YYYY HH:mm:ss') : this.evento.dt_criou,
      dt_para_exibir: this.evento.dt_para_exibir ? moment(this.evento.dt_para_exibir).format('DD/MM/YYYY HH:mm:ss') : this.evento.dt_para_exibir,
      dt_prevista_resolucao: this.evento.dt_prevista_resolucao ? moment(this.evento.dt_prevista_resolucao).format('DD/MM/YYYY HH:mm:ss') : this.evento.dt_prevista_resolucao,
      pessoa_criou: this.evento.pessoa_criou,
      destino: this.evento.destino,
      cliente: this.evento.cliente,
      telefone: this.evento.telefone,
      objecao: this.evento.objecao,
      resposta_motivo: this.evento.resposta_motivo,
      predicao: this.evento.predicao,
      pessoa_visualizou: this.evento.pessoa_visualizou,
      pessoa_resolveu: this.evento.pessoa_resolveu,
      dt_visualizou: this.evento.dt_visualizou ? moment(this.evento.dt_visualizou).format('DD/MM/YYYY HH:mm:ss') : this.evento.dt_visualizou,
      dt_resolvido: this.evento.dt_resolvido ? moment(this.evento.dt_resolvido).format('DD/MM/YYYY HH:mm:ss') : this.evento.dt_resolvido,
      observacao_origem: this.evento.observacao_origem,
      observacao_retorno: this.evento.observacao_retorno,
      id_proposta: this.evento.id_proposta,
    });
  }

  abrirCadastroPessoa() {
    return this.router.navigate(['pessoas/'+this.evento.id_pessoa_receptor]);
  }

  abrirProposta() {
    return this.router.navigate(['proposta/'+this.evento.id_proposta]);
  }

  
  async cadastroPessoa() {

    let pessoaId = this.evento.id_pessoa_receptor;
    let p = await this.connectHTTP.callService({
      service: 'getPessoa',
      paramsService: {
        id_pessoa: pessoaId
      }
    }) as any;
    this.pessoa = new Observable(o => o.next(p.resposta));

    this.pessoaEditando.show()
  }

  async refresh() {
    let pessoaId = this.evento.id_pessoa_receptor;
    let pessoa = await this.connectHTTP.callService({
      service: 'getPessoa',
      paramsService: {
        id_pessoa: pessoaId
      }
    }) as any;
    this.pessoa = new Observable(o => o.next(pessoa.resposta));
  }

}
