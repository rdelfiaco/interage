import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { IMyOptions, ToastService } from '../../../lib/ng-uikit-pro-standard';
import { Observable } from 'rxjs';
import * as moment from 'moment';
@Component({
  selector: 'app-criar-evento',
  templateUrl: './criar-evento.component.html',
  styleUrls: ['./criar-evento.component.scss']
})
export class CriarEventoComponent implements OnInit {
  _pessoa: any
  @Input()
  set pessoa(pessoa: any): any {
    pessoa.subscribe((pessoa) => {
      this.pessoaId = new Observable((observer) => {
        observer.next(pessoa.principal.id)
      })
      this.criarEventoForm.controls['pessoaId'].setValue(pessoa.principal.id);
    });
  }
  get pessoa(): any {
    return this._pessoa;
  }
  pessoaId: any;
  @Input() evento: any
  @Output() fechaModal = new EventEmitter()
  criarEventoForm: FormGroup;
  departamentoSelect: Array<any>
  canaisSelect: Array<any>
  usuarioSelect: Array<any>
  optionsTipoDestino: Array<any>

  public myDatePickerOptions: IMyOptions = {
    dayLabels: { su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sab' },
    dayLabelsFull: { su: "Domingo", mo: "Segunda", tu: "Terça", we: "Quarta", th: "Quinta", fr: "Sexta", sa: "Sábado" },
    monthLabels: { 1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez' },
    monthLabelsFull: { 1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril", 5: "Maio", 6: "Junho", 7: "Julho", 8: "Agosto", 9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro" },

    // Buttons
    todayBtnTxt: "Hoje",
    clearBtnTxt: "Limpar",
    closeBtnTxt: "Fechar",
    closeAfterSelect: true,
    dateFormat: 'dd/mm/yyyy',
  }

  constructor(formBuilder: FormBuilder, private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage, private toastrService: ToastService) {
    this.criarEventoForm = formBuilder.group({
      tipodestino: ['P', [
        Validators.required
      ]],
      pessoaOrgonograma: ['', [
        Validators.required
      ]],
      canal: ['', [
        Validators.required
      ]],
      pessoaId: ['', [Validators.required]],
      data: [''],
      hora: [''],
      observacao: ['']
    })
  }

  async ngOnInit() {
    debugger
    let eventoEncontrado = await this.connectHTTP.callService({
      service: 'informacoesParaCriarEvento',
      paramsService: {
      }
    }) as any;

    this.departamentoSelect = eventoEncontrado.resposta.organograma;
    this.departamentoSelect = this.departamentoSelect.map(departamento => {
      return { value: departamento.id, label: departamento.nome }
    });

    this.canaisSelect = eventoEncontrado.resposta.canais;
    this.canaisSelect = this.canaisSelect.map(canal => {
      return { value: canal.id, label: canal.nome }
    });

    this.usuarioSelect = eventoEncontrado.resposta.usuarios;
    this.usuarioSelect = this.usuarioSelect.map(usuario => {
      return { value: usuario.id, label: usuario.nome }
    });
    this.optionsTipoDestino = this.usuarioSelect;
  }

  onSelectTipoPessoa(valor) {
    debugger;
    if (valor.value == 'P')
      this.optionsTipoDestino = this.usuarioSelect;
    else this.optionsTipoDestino = this.departamentoSelect;
  }

  onSelectCliente(valor) {
    this.criarEventoForm.value.pessoaId = valor.value;
  }

  tipoPessoa: Array<object> = [
    {
      value: 'P',
      label: "Usuário"
    },
    {
      value: 'O',
      label: "Departamento"
    },
  ]

  async criarEvento() {
    let dataExibir = moment(this.criarEventoForm.value.data + ' - ' + this.criarEventoForm.value.hora, 'DD/MM/YYYY - hh:mm').toISOString()
    const usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;
    debugger;
    let res = await this.connectHTTP.callService({
      service: 'encaminhaEvento',
      paramsService: {
        id_pessoa_resolveu: usuarioLogado.id_pessoa,
        id_evento: this.evento.id,
        id_campanha: this.evento.id_campanha,
        id_motivo: this.evento.id_motivo,
        id_evento_pai: this.evento.id,
        dt_para_exibir: dataExibir,
        tipoDestino: this.criarEventoForm.value.tipodestino,
        id_pessoa_organograma: this.criarEventoForm.value.pessoaOrgonograma,
        id_pessoa_receptor: this.criarEventoForm.value.pessoaId,
        observacao_origem: this.criarEventoForm.value.observacao,
        id_canal: this.criarEventoForm.value.canal,
      }
    }) as any;
    this.toastrService.success('Evento encaminhado com sucesso!');
    this.fechaModal.emit();
  }
}