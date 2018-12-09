import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { IMyOptions } from '../../../lib/ng-uikit-pro-standard';

@Component({
  selector: 'app-criar-evento',
  templateUrl: './criar-evento.component.html',
  styleUrls: ['./criar-evento.component.scss']
})
export class CriarEventoComponent implements OnInit {
  @Input() pessoa: any
  @Input() evento: any
  criarEventoForm: FormGroup;
  departamentoSelect: Array<any>
  canaisSelect: Array<any>
  usuarioSelect: Array<any>
  initValueId: string = '12';
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

  constructor(formBuilder: FormBuilder, private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage) {
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
      pessoaId: ['', [Validators.required]]
    })
  }

  async ngOnInit() {
   
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

}
