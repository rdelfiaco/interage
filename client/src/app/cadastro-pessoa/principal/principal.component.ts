import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IMyOptions, ToastService } from '../../../lib/ng-uikit-pro-standard';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { Usuario } from '../../login/usuario';
import { LocalStorage } from '../../shared/services/localStorage';


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
  private _pessoa: any;
  private usuarioLogado: any;
  @Output() refresh = new EventEmitter();
  @Output() refreshPessoaAdd = new EventEmitter();
  @Input()
  set pessoa(evento: any) {
    this._pessoa = evento;
    if (this._pessoa)
      this._setQuestionarioForm();
  }

  get pessoa(): any {
    return this._pessoa
  }

  tipoDePessoa: Array<object> = [
    {
      value: 'F',
      label: "Física"
    },
    {
      value: 'J',
      label: "Jurídica"
    },
  ]

  tipoDeTratamentoFisica: any;
  atividadesPessoaFisica: any;
  atividadesPessoaJuridica: any;
  serchFilter: string;

  tipoPessoaSelecionada: string = 'F';
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
    closeAfterSelect: true,
    minYear: 1900,

    // Format
    dateFormat: 'dd/mm/yyyy',
  }

  enumSexo: Array<object> = [
    {
      value: 'F',
      label: "Feminino"
    },
    {
      value: 'M',
      label: "Masculino"
    },
  ]

  constructor(private formBuilder: FormBuilder,
    private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private toastrService: ToastService) {
    this.principalForm = this.formBuilder.group({
      id: [''],
      nome: ['', [Validators.required]],
      tipo: [this.tipoPessoaSelecionada, [Validators.required]],
      id_pronome_tratamento: [''],
      datanascimento: [''],
      sexo: [''],
      rg_ie: [''],
      orgaoemissor: [''],
      cpf_cnpj: [''],
      email: [''],
      website: [''],
      observacoes: [''],
      apelido_fantasia: [''],
      id_atividade: [''],
    })
  }

  _setQuestionarioForm() {
    this.tipoPessoaSelecionada = this.pessoa.principal.tipo;

    this.principalForm = this.formBuilder.group({
      id: [this.pessoa.principal.id],
      nome: [this.pessoa.principal.nome, [Validators.required]],
      tipo: [this.pessoa.principal.tipo, [Validators.required]],
      id_pronome_tratamento: [this.pessoa.principal.id_pronome_tratamento],
      datanascimento: [''],
      sexo: [this.pessoa.principal.sexo],
      rg_ie: [this.pessoa.principal.rg_ie],
      orgaoemissor: [this.pessoa.principal.orgaoemissor],
      cpf_cnpj: [this.pessoa.principal.cpf_cnpj],
      email: [this.pessoa.principal.email],
      website: [this.pessoa.principal.website],
      observacoes: [this.pessoa.principal.observacoes],
      apelido_fantasia: [this.pessoa.principal.apelido_fantasia],
      id_atividade: [this.pessoa.principal.id_atividade],
    })
  }

  async ngOnInit() {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;

    let tratamento = await this.connectHTTP.callService({
      service: 'getTratamentoPessoaFisica',
      paramsService: {}
    }) as any;

    this.tipoDeTratamentoFisica = tratamento.resposta.map((t) => {
      return { label: t.descricao, value: t.id };
    })


    let atividades = await this.connectHTTP.callService({
      service: 'getAtividades',
      paramsService: {}
    }) as any;

    this.atividadesPessoaFisica = atividades.resposta
      .filter(r => r.tipo === 'F')
      .map((t) => {
        return { label: t.name, value: t.id };
      })

    this.atividadesPessoaJuridica = atividades.resposta
      .filter(r => r.tipo === 'J')
      .map((t) => {
        return { label: t.name, value: t.id };
      })
  }

  getSelectedValuePessoa(pessoa: selectValues) {
    this.tipoPessoaSelecionada = pessoa.value;
  }

  async salvarPessoa() {
    this.principalForm.value.cpf_cnpj = this.principalForm.value.cpf_cnpj && this.principalForm.value.cpf_cnpj.replace(/\W/gi, '')

    this.checkAtividadePessoa()

    if (this.principalForm.value.id) {
      try {
        await this.connectHTTP.callService({
          service: 'salvarPessoa',
          paramsService: this.principalForm.value
        });
        this.toastrService.success('Salvo com sucesso');
      }
      catch (e) {
        this.toastrService.error('Erro ao salvar pessoa');
      }
    }
    else {
      try {
        const res = await this.connectHTTP.callService({
          service: 'adicionarPessoa',
          paramsService: this.principalForm.value
        }) as any;
        this.refreshPessoaAdd.emit({ idPessoa: res.resposta.id });
        this.toastrService.success('Salvo com sucesso');
      }
      catch (e) {
        this.toastrService.error('Erro ao salvar pessoa');
      }
    }
  }
  checkAtividadePessoa() {
    if (this.principalForm.value.tipo === 'F') {
      let atividadeDaPessoa = this.atividadesPessoaFisica.filter(atividade => atividade.value == this.principalForm.value.id_atividade)
      if (!atividadeDaPessoa.length) this.principalForm.value.id_atividade = null;
    }
    else {
      let atividadeDaPessoa = this.atividadesPessoaJuridica.filter(atividade => atividade.value == this.principalForm.value.id_atividade)
      if (!atividadeDaPessoa.length) this.principalForm.value.id_atividade = null;
    }
  }

  nomeMaiusculo(){
    this.principalForm.controls['nome'].setValue(this.principalForm.value.nome.toUpperCase())
  }



}
