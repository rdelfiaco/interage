import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { IMyOptions, MDBDatePickerComponent } from '../../lib/ng-uikit-pro-standard';

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
  private _evento;
  private _pessoa;
  private _motivos_respostas: Array<object>;
  questionarioForm: FormGroup;
  telefones: Array<string>;
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

  @Input()
  set evento(evento: string) {
    this._evento = evento;
    if (this._pessoa) this._setQuestionarioForm();
  }

  get evento(): string {
    return this._evento
  }


  @Input()
  set pessoa(pessoa: string) {
    this._pessoa = pessoa;
    if (this._evento) this._setQuestionarioForm();
  }

  get pessoa(): string {
    return this._pessoa
  }

  @Input()
  set motivos_respostas(motivos_respostas: string) {
    this._motivos_respostas = motivos_respostas;
    this.motivosRespostasFormatado = motivos_respostas.map(m => {
      return { label: m.nome, value: m.id }
    })
  }

  get motivos_respostas(): Array<object> {
    return this._motivos_respostas
  }

  constructor(private formBuilder: FormBuilder) {
    this.questionarioForm = this.formBuilder.group({
      pessoaALigar: [''],
      telefones: [''],
      telefonePrincipal: ['']
    })

  }

  ngOnInit() {
  }

  _setQuestionarioForm() {
    debugger
    this.telefones = this.pessoa.telefones.map(t => {
      return {
        id: t.id, numero: `${t.ddi || '+55'} ${t.ddd} ${t.telefone}`
      }
    });

    this.questionarioForm = this.formBuilder.group({
      pessoaALigar: [this.pessoa.principal.nome],
      telefonePrincipal: this.pessoa.telefones.filter(t => {
        if (t.principal)
          return true
      }).map(telefonePrincipal => `${telefonePrincipal.ddi || '+55'} ${telefonePrincipal.ddd} ${telefonePrincipal.telefone}`),
      motivoRespostaSelecionado: ['', [
        Validators.required
      ]],
      observacao: ['', [
        Validators.required
      ]],
      data: [''],
      hora: ['']
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
    this.questionarioForm.controls['telefonePrincipal'].setValue(this.telefones.filter(t => t.id == telefoneId)[0].numero);
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
  gravarLigacao() {
    this.modal.hide()
  }
}