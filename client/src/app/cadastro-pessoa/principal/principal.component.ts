import { format } from './../../shared/validaCpf';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IMyOptions, ToastService } from '../../../lib/ng-uikit-pro-standard';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { Usuario } from '../../login/usuario';
import { LocalStorage } from '../../shared/services/localStorage';
import validaCpf from '../../shared/validaCpf';
import validaCnpj from '../../shared/validaCnpj';
import * as moment from 'moment';


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
  tiposDeCliente: any;
  classificacoesDeCliente: any;
  usuariosCarteira: any;
  atividadesPessoaFisica: any;
  atividadesPessoaJuridica: any;
  serchFilter: string;

  tipoPessoaSelecionada: string = 'F';
  principalForm: FormGroup
  principalFormAud: any;

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
      id: [{value:'', disable: true}],
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
      cnh:[''],
      cnh_validade:[''],
      cnh_categoria:[''],
      id_tipo_cliente:[''],
      id_classificacao_cliente:[''],
      id_usuario_carteira:[''],
    })
    this.principalFormAud = this.principalForm.value;
  }



  _setQuestionarioForm() {
    this.tipoPessoaSelecionada = this.pessoa.principal.tipo;
    this.principalForm = this.formBuilder.group({
      id: [this.pessoa.principal.id],
      nome: [this.pessoa.principal.nome, [Validators.required]],
      tipo: [this.pessoa.principal.tipo, [Validators.required]],
      id_pronome_tratamento: [this.pessoa.principal.id_pronome_tratamento],
      datanascimento: [ this.pessoa.principal.datanascimento ? moment(this.pessoa.principal.datanascimento ).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY') ],
      sexo: [this.pessoa.principal.sexo],
      rg_ie: [this.pessoa.principal.rg_ie],
      orgaoemissor: [this.pessoa.principal.orgaoemissor],
      cpf_cnpj: [this.pessoa.principal.cpf_cnpj],
      email: [this.pessoa.principal.email],
      website: [this.pessoa.principal.website],
      observacoes: [this.pessoa.principal.observacoes],
      apelido_fantasia: [this.pessoa.principal.apelido_fantasia],
      id_atividade: [this.pessoa.principal.id_atividade],
      cnh: [this.pessoa.principal.cnh],
      cnh_validade:  [ this.pessoa.principal.cnh_validade ?  moment(this.pessoa.principal.cnh_validade ).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY')],
      cnh_categoria: [this.pessoa.principal.cnh_categoria],
      id_tipo_cliente: [this.pessoa.principal.id_tipo_cliente],
      id_classificacao_cliente: [this.pessoa.principal.id_classificacao_cliente],
      id_usuario_carteira: [this.pessoa.principal.id_usuario_carteira]
    })
    this.principalFormAud = this.principalForm.value;
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

    let getTipoClientes = await this.connectHTTP.callService({
      service: 'getTipoClientes',
      paramsService: {}
    }) as any;

    this.tiposDeCliente = getTipoClientes.resposta.map((t) => {
      if(t.status) return { label: t.nome, value: t.id };
    })

    let getClassificacaoClientes = await this.connectHTTP.callService({
      service: 'getClassificacaoClientes',
      paramsService: {}
    }) as any;

    this.classificacoesDeCliente = getClassificacaoClientes.resposta.map((t) => {
      if(t.status) return { label: t.nome, value: t.id };
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

      let getUsuarios = await this.connectHTTP.callService({
        service: 'getUsuarios',
        paramsService: {}
      }) as any;
      this.usuariosCarteira  = getUsuarios.resposta.map((t) => {
        if(t.status){
        return { label: t.nome, value: t.id_usuario };
      } else
      {
        return { label: `_Inativo -> ${t.nome}`  , value: t.id_usuario };
      }
      })
      // order pelo nome o usuos carteira 
      this.usuariosCarteira.sort(function (a, b) {
        if (a.label > b.label) {
          return 1;
        }
        if (a.label < b.label) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });



  }





  getSelectedValuePessoa(pessoa: selectValues) {
    this.tipoPessoaSelecionada = pessoa.value;
  }

  async salvarPessoa() {
    this.principalForm.value.cpf_cnpj = this.principalForm.value.cpf_cnpj && this.principalForm.value.cpf_cnpj.replace(/\W/gi, '')

    if (this.tipoPessoaSelecionada == 'F' && !validaCpf.isValid(this.principalForm.value.cpf_cnpj)) {
       return this.toastrService.error('Informe um CPF válido');
    }

    if (this.tipoPessoaSelecionada == 'J' && !validaCnpj.isValid(this.principalForm.value.cpf_cnpj)) {
       return this.toastrService.error('Informe um CNPJ válido');
    }

    // se a data de nascimento e dt de validade da CNH for igual a data de hoje 
    // pressupõe que o usuário não deseja informar as datas  
    if (this.principalForm.controls['datanascimento'].value == moment().format('DD/MM/YYYY')
    ) { this.principalForm.controls['datanascimento'].setValue('');}

    if (this.principalForm.controls['cnh_validade'].value == moment().format('DD/MM/YYYY')
    ) { this.principalForm.controls['cnh_validade'].setValue('');}


    this.checkAtividadePessoa()
    ;
    if (this.principalForm.controls['id'].value.value != '') {
      try {
        await this.connectHTTP.callService({
          service: 'salvarPessoa',
          paramsService: ({
            dadosAtuais: JSON.stringify(this.principalForm.value),
            dadosAnteriores: JSON.stringify(this.principalFormAud)
          }) 
        });
        this.toastrService.success('Salvo com sucesso');
      }
      catch (e) {
        this.toastrService.error('Erro ao salvar pessoa');
      }
    }
    else {
        const res = await this.connectHTTP.callService({
          service: 'adicionarPessoa',
          paramsService: ({
            dadosAtuais: JSON.stringify(this.principalForm.value),
            dadosAnteriores: JSON.stringify(this.principalFormAud)
          }) 
        }) as any;
        
        this.principalForm.controls['id'].enable();

        this.principalForm.controls['id'].setValue(res.resposta.id);

        this.principalForm.controls['id'].disable();

        this.toastrService.success('Salvo com sucesso');

        this.refreshPessoaAdd.emit({ idPessoa: res.resposta.id });    
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
    this.principalForm.controls['nome'].setValue(this.principalForm.value.nome.toUpperCase());

    this.principalForm.controls['apelido_fantasia'].setValue(this.principalForm.value.nome);

  }
}
