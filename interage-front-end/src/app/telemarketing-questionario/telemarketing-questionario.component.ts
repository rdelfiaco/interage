import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { IMyOptions, MDBDatePickerComponent } from '../../lib/ng-uikit-pro-standard';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { Usuario } from '../login/usuario';
import { LocalStorage } from '../shared/services/localStorage';
import * as moment from 'moment';
import { MascaraTelefonePipe } from '../shared/pipes/mascaraTelefone/mascara-telefone.pipe';

interface selectValues {
  value: string
  label: string
}

@Component({
  selector: 'app-telemarketing-questionario',
  templateUrl: './telemarketing-questionario.component.html',
  styleUrls: ['./telemarketing-questionario.component.scss'],
  providers: [MascaraTelefonePipe]
})
export class TelemarketingQuestionarioComponent implements OnInit {
  private _pessoaObject: any;
  private _eventoObject: any;
  private _motivos_respostas: Array<object>;
  private _predicoes: Array<object>;
  predicoesFormatado: Array<object>
  questionarioForm: FormGroup;
  motivosRespostasFormatado: Array<object>
  motivoRespostaSelecionado: object
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
  reagendar: boolean = false;
  exige_observacao: boolean = false;
  exige_predicao: boolean = false;
  discando: boolean = false;
  podeGravar: boolean = false;
  @ViewChild("dataReagendamento") datePicker: MDBDatePickerComponent;

  @Input() modal: any
  @Input() campanhaSelecionada: any
  @Input() clear: any
  @Input() pessoa: any;
  @Input() evento: any;

  @Input()
  set motivos_respostas(motivos_respostas: any) {
    this._motivos_respostas = motivos_respostas;
    this.motivosRespostasFormatado = motivos_respostas.map(m => {
      return { label: m.nome, value: m.id }
    }).sort((a, b) => {
      if (a.label > b.label) return 1;
      else if (a.label < b.label) return -1;
      else return 0;
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

  ValidateObservacao(control: AbstractControl) {
    if (this.exige_observacao && !control.value) return { exige_observacao: true };
    else return null;
  }

  ValidateExigePredicao(control: AbstractControl) {
    if (this.exige_predicao && !control.value) return { exige_predicao: true };
    else return null;
  }

  ValidateReagendar(control: AbstractControl) {
    if (this.reagendar && !control.value) return { exige_predicao: true };
    else return null;
  }

  constructor(private formBuilder: FormBuilder,
    private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private mascaraTelefone: MascaraTelefonePipe) {
    this.questionarioForm = this.formBuilder.group({
      pessoaALigar: [''],
      telefones: [''],
      telefonePrincipal: ['']
    })
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
        debugger;
        if (this._eventoObject) this._setQuestionarioForm();
      });
    }
    if (changes["evento"] && this.evento) {
      this.evento.subscribe(evento => {
        this._eventoObject = evento
        if (this._pessoaObject) this._setQuestionarioForm();
      });
    }
  }

  _setQuestionarioForm() {
    debugger;
    this.questionarioForm = this.formBuilder.group({
      pessoaALigar: [this._pessoaObject.principal.nome],
      telefonePrincipal: this.mascaraTelefone.transform(this._pessoaObject.telefones.filter(t => {
        if (t.principal)
          return true
      }).map(telefonePrincipal => `${telefonePrincipal.ddi}${telefonePrincipal.ddd}${telefonePrincipal.telefone}`)[0]),
      idTelefoneSelecionado: this._pessoaObject.telefones.filter(t => {
        if (t.principal)
          return true
      }).map(telefonePrincipal => telefonePrincipal.id),
      motivoRespostaSelecionado: ['', [
        Validators.required
      ]],
      observacao: ['', [this.ValidateObservacao.bind(this)]],
      data: ['', [this.ValidateReagendar.bind(this)]],
      hora: ['', [this.ValidateReagendar.bind(this)]],
      id_predicao: ['', [this.ValidateExigePredicao.bind(this)]]
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

  camposPreenchidos() {
    if (this.reagendar && (!this.questionarioForm.value.data || !this.questionarioForm.value.hora))
      return false;
    if (this.exige_observacao && (!this.questionarioForm.value.observacao))
      return false;
    return true;
  }

  trocaTelefonePrincipal(telefoneId: string) {
    const numTelefone = this._pessoaObject.telefones.filter((t: any) => t.id == telefoneId) as any;

    this.questionarioForm.controls['telefonePrincipal'].setValue(this.mascaraTelefone.transform(`${numTelefone[0].ddi}${numTelefone[0].ddd} ${numTelefone[0].telefone}`));
    this.questionarioForm.controls['idTelefoneSelecionado'].setValue(telefoneId);
    this.discando = false;
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

        self.questionarioForm.controls['observacao'].updateValueAndValidity();
      }
    })
  }

  discar() {
    this.discando = true;
  }
  async gravarLigacao() {
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
        id_telefoneDiscado: this.questionarioForm.value.idTelefoneSelecionado,
        id_predicao: this.questionarioForm.value.id_predicao,
        id_campanha: this.campanhaSelecionada,
        observacao: this.questionarioForm.value.observacao,
        data: moment(this.questionarioForm.value.data + ' - ' + this.questionarioForm.value.hora, 'DD/MM/YYYY - hh:mm').toISOString(),
      }
    });
    this._limpar();
    this.modal.hide()
  }

  _limpar() {
    this.questionarioForm = null;
    this.questionarioForm = this.formBuilder.group({
      pessoaALigar: [''],
      telefones: [''],
      telefonePrincipal: ['']
    });
    this.reagendar = false;
    this.exige_observacao = null
    this.exige_predicao = null
    this.discando = false;
    this.podeGravar = false;
    this.motivoRespostaSelecionado = null;
    this.evento = null;
    this.pessoa = null;
    this._motivos_respostas = null
    this.motivosRespostasFormatado = null;
    this.motivoRespostaSelecionado = null;
    this.clear();
  }
}