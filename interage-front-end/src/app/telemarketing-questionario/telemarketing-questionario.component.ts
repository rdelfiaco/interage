import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { IMyOptions, MDBDatePickerComponent } from '../../lib/ng-uikit-pro-standard';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { Usuario } from '../login/usuario';
import { LocalStorage } from '../shared/services/localStorage';

interface selectValues {
  value: string
  label: string
}

@Component({
  selector: 'app-telemarketing-questionario',
  templateUrl: './telemarketing-questionario.component.html',
  styleUrls: ['./telemarketing-questionario.component.scss']
})
export class TelemarketingQuestionarioComponent implements OnInit {
  private _pessoaObject: any;
  private _eventoObject: any;
  private _motivos_respostas: Array<object>;
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
    })
  }

  get motivos_respostas(): any {
    return this._motivos_respostas
  }

  constructor(private formBuilder: FormBuilder, private connectHTTP: ConnectHTTP, private localStorage: LocalStorage) {
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
    this.questionarioForm = this.formBuilder.group({
      pessoaALigar: [this._pessoaObject.principal.nome],
      telefonePrincipal: this._pessoaObject.telefones.filter(t => {
        if (t.principal)
          return true
      }).map(telefonePrincipal => `${telefonePrincipal.ddi || '+55'} ${telefonePrincipal.ddd} ${telefonePrincipal.telefone}`),
      idTelefoneSelecionado: this._pessoaObject.telefones.filter(t => {
        if (t.principal)
          return true
      }).map(telefonePrincipal => telefonePrincipal.id),
      motivoRespostaSelecionado: ['', [
        Validators.required
      ]],
      observacao: ['', [
        Validators.required
      ]],
      data: ['', [Validators.required]],
      hora: ['', [Validators.required]]
    })

    let data = new Date();
    let date = {
      date: {
        year: data.getFullYear(),
        month: data.getMonth() + 1,
        day: data.getDate()
      }
    }
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

  trocaTelefonePrincipal(telefoneId: string) {
    const numTelefone = this._pessoaObject.telefones.filter((t: any) => t.id == telefoneId) as any;

    this.questionarioForm.controls['telefonePrincipal'].setValue(`${numTelefone[0].ddi} ${numTelefone[0].ddd} ${numTelefone[0].telefone}`);
    this.questionarioForm.controls['idTelefoneSelecionado'].setValue(telefoneId);
    this.discando = false;
  }

  selecionaMotivoResposta(motivoResposta: selectValues) {
    this.motivos_respostas.some((motivo) => {
      if (motivo.id == motivoResposta.value) {
        this.questionarioForm.controls['motivoRespostaSelecionado'].setValue(motivoResposta.value)
        if (motivo.reagendar)
          this.reagendar = true;
        else this.reagendar = false
      }
    })
  }

  discar() {
    this.discando = true;
  }
  async gravarLigacao() {
    const usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;

    const dataObj = this.questionarioForm.value.data;
    const data = `${dataObj.date.day}/${dataObj.date.month}/${dataObj.date.year}`
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
        id_campanha: this.campanhaSelecionada,
        observacao: this.questionarioForm.value.observacao,
        data,
        hora: this.questionarioForm.value.hora,
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