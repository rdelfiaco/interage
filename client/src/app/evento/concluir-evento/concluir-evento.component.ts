import { Component, OnInit, Input, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MDBDatePickerComponent, IMyOptions } from '../../../lib/ng-uikit-pro-standard';
import * as moment from 'moment';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';

interface selectValues {
  value: string
  label: string
}

@Component({
  selector: 'app-concluir-evento',
  templateUrl: './concluir-evento.component.html',
  styleUrls: ['./concluir-evento.component.scss']
})
export class ConcluirEventoComponent implements OnInit {
  _pessoaObject: any
  _eventoObject: any
  motivosRespostasFormatado: Array<object>
  private _motivos_respostas: Array<object>;
  questionarioForm: FormGroup;
  reagendar: boolean = false;
  exige_observacao: boolean = false;
  exige_predicao: boolean = false;
  exige_objecao: boolean = false;
  private _predicoes: Array<object>;
  predicoesFormatado: Array<object>
  private _objecoes: Array<object>;
  objecoesFormatado: Array<object>
  @Output() fechaModal = new EventEmitter();
  @ViewChild("dataReagendamento") datePicker: MDBDatePickerComponent;
  public myDatePickerOptions: IMyOptions = {
    // Strings and translations
    dayLabels: { su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sab' },
    dayLabelsFull: { su: "Domingo", mo: "Segunda", tu: "Terça", we: "Quarta", th: "Quinta", fr: "Sexta", sa: "Sábado" },
    monthLabels: { 1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez' },
    monthLabelsFull: { 1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril", 5: "Maio", 6: "Junho", 7: "Julho", 8: "Agosto", 9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro" },

    // Buttons
    todayBtnTxt: "Hoje",
    clearBtnTxt: "Limpar",
    closeBtnTxt: "Fechar",
    closeAfterSelect: true,

    // Format
    dateFormat: 'dd/mm/yyyy',
  }

  @Input() pessoa: any
  @Input() evento: any

  @Input()
  set motivos_respostas(motivos_respostas: any) {
    this._motivos_respostas = motivos_respostas;
    this.motivosRespostasFormatado = motivos_respostas.sort((a, b) => {
      if (a.ordem_listagem > b.ordem_listagem) return 1;
      else if (a.ordem_listagem < b.ordem_listagem) return -1;
      else return 0;
    }).map(m => {
      return { label: m.nome, value: m.id }
    })
  }

  get motivos_respostas(): any {
    return this._motivos_respostas
  }
  @Input()
  set predicoes(predicoes: any) {
    this._predicoes = predicoes;
    this.predicoesFormatado = predicoes.map(p => {
      return { label: p.nome, value: p.id, cor: p.cor }
    })
  }

  get predicoes(): any {
    return this._predicoes
  }

  @Input()
  set objecoes(objecoes: any) {
    this._objecoes = objecoes;
    this.objecoesFormatado = objecoes.map(p => {
      return { label: p.nome, value: p.id, cor: p.cor }
    })
  }

  get objecoes(): any {
    return this._objecoes
  }

  constructor(formBuilder: FormBuilder, private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage) {
    this.questionarioForm = formBuilder.group({
      motivoRespostaSelecionado: ['', [
        Validators.required
      ]],
      observacao: ['', [this.ValidateObservacao.bind(this)]],
      data: ['', [this.ValidateReagendar.bind(this)]],
      hora: ['', [this.ValidateReagendar.bind(this)]],
      id_predicao: ['', [this.ValidateExigePredicao.bind(this)]],
      id_objecao: ['', [this.ValidateExigeObjecao.bind(this)]]
    })


    let data = new Date();
    let date = moment().format('DD/MM/YYYY');

    this.questionarioForm.controls['data'].setValue(date);

    let hours = getHora(data);
    this.questionarioForm.controls['hora'].setValue(hours);

    function getHora(data: Date) {
      let hora = trataTempo(data.getHours() + 1)
      let minutos = trataTempo(data.getMinutes())
      return `${hora}:${minutos}`
    }

    function trataTempo(tempo: number) {
      if (tempo.toString().length == 1) return `0${tempo}`
      return tempo;
    }
  }

  ValidateObservacao(control: AbstractControl) {
    if (this.exige_observacao && !control.value) return { exige_observacao: true };
    else return null;
  }

  ValidateExigePredicao(control: AbstractControl) {
    if (this.exige_predicao && !control.value) return { exige_predicao: true };
    else return null;
  }

  ValidateExigeObjecao(control: AbstractControl) {
    if (this.exige_objecao && !control.value) return { exige_objecao: true };
    else return null;
  }

  ValidateReagendar(control: AbstractControl) {
    if (this.reagendar && !control.value) return { reagendar: true };
    else return null;
  }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes["pessoa"] && this.pessoa) {
      this.pessoa.subscribe(pessoa => {
        this._pessoaObject = pessoa
        this._pessoaObject.telefones = this._pessoaObject.telefones.map((telefone) => {
          return {
            ...telefone,
            telefoneCompleto: telefone.ddi + telefone.ddd + telefone.telefone
          }
        });
      });
    }
    if (changes["evento"] && this.evento) {
      this.evento.subscribe(evento => {
        this._eventoObject = evento
      });
    }
  }
  selecionaMotivoResposta(motivoResposta: selectValues) {
    const self = this;
    this.motivos_respostas.some((motivo) => {
      if (motivo.id == motivoResposta.value) {
        this.questionarioForm.controls['motivoRespostaSelecionado'].setValue(motivoResposta.value)
        if (motivo.reagendar)
          this.reagendar = true;
        else this.reagendar = false

        if (motivo.exige_observacao)
          this.exige_observacao = true;
        else this.exige_observacao = false

        if (motivo.exige_predicao)
          this.exige_predicao = true;
        else this.exige_predicao = false

        if (motivo.exige_objecao)
          this.exige_objecao = true;
        else this.exige_objecao = false

        self.questionarioForm.controls['observacao'].updateValueAndValidity();
      }
    })
  }

  async concluiEvento() {
    const usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;

    await this.connectHTTP.callService({
      service: 'salvarEvento',
      paramsService: {
        token: usuarioLogado.token,
        id_pessoa: usuarioLogado.id_pessoa,
        id_usuario: usuarioLogado.id,
        id_evento: this._eventoObject.id,
        id_evento_pai: this._eventoObject.id_evento_pai ? this._eventoObject.id_evento_pai : this._eventoObject.id,
        id_pessoa_receptor: this._eventoObject.id_pessoa_receptor,
        id_motivos_respostas: this.questionarioForm.value.motivoRespostaSelecionado,
        id_telefoneDiscado: this.questionarioForm.value.idTelefoneSelecionado || '',
        id_predicao: this.questionarioForm.value.id_predicao,
        id_objecao: this.questionarioForm.value.id_objecao,
        id_campanha: this._eventoObject.id_campanha,
        observacao: this.questionarioForm.value.observacao,
        data: moment(this.questionarioForm.value.data + ' - ' + this.questionarioForm.value.hora, 'DD/MM/YYYY - HH:mm').toISOString(),
      }
    });
    this.fechaModal.emit();
  }
}
