import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { IMyOptions } from '../../lib/ng-uikit-pro-standard';

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


  questionarioForm: FormGroup;
  telefones: Array<string>;
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

    // Format
    dateFormat: 'dd/mm/yyyy',
  }

  status: Array<object> = [
    {
      value: '1',
      label: "Ocupado"
    },
    {
      value: '2',
      label: "Telefone Errado"
    },
    {
      value: '3',
      label: "Contato com sucesso"
    },
    {
      value: '4',
      label: "Follow UP"
    },
  ]
  reagendar: boolean = false;
  discando: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.questionarioForm = this.formBuilder.group({
      pessoaALigar: [''],
      telefones: [''],
      telefonePrincipal: [''],
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
      }).map(telefonePrincipal => `${telefonePrincipal.ddi || '+55'} ${telefonePrincipal.ddd} ${telefonePrincipal.telefone}`)
    })
  }

  trocaTelefonePrincipal(telefoneId: string) {
    this.questionarioForm.controls['telefonePrincipal'].setValue(this.telefones.filter(t => t.id == telefoneId)[0].numero);
    this.discando = false;
  }

  getSelectedValue(status: selectValues) {
    if (status.value == '1' || status.value == '4') this.reagendar = true;
    else this.reagendar = false;
  }

  discar() {
    this.discando = true;
  }
}