import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IMyOptions } from '../../../lib/ng-uikit-pro-standard';


interface selectValues {
  value: string
  label: string
}

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
  tipoDePessoa: Array<object> = [
    {
      value: '1',
      label: "Física"
    },
    {
      value: '2',
      label: "Jurídica"
    },
  ]

  tipoDeTratamentoFisica: Array<object> = [
    {
      value: '1',
      label: "Dr."
    },
    {
      value: '2',
      label: "Dra."
    },
    {
      value: '3',
      label: "Exmo."
    },
    {
      value: '4',
      label: "Ilmo."
    },
    {
      value: '5',
      label: "Ms."
    },
    {
      value: '6',
      label: "Sr."
    },
    {
      value: '7',
      label: "Sra."
    },
    {
      value: '8',
      label: "Sta."
    },
  ]
  tipoPessoaSelecionada: string = '1'
  principalForm: FormGroup

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

  enumSexo: Array<object> = [
    {
      value: '1',
      label: "Feminino"
    },
    {
      value: '2',
      label: "Masculino"
    },
  ]
  
  constructor(private formBuilder: FormBuilder) {
    this.principalForm = this.formBuilder.group({
      id: ['1234'],
      nome: ['Usuario de Teste'],
      pessoa: '1',
      tratamento: '6',
      sexo: '2'
    })
  }

  ngOnInit() {
  }

  getSelectedValuePessoa(pessoa: selectValues) {
    this.tipoPessoaSelecionada = pessoa.value;
  }

}
