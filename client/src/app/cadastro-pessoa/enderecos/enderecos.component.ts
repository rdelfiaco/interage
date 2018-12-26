import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { LocalStorage } from '../../shared/services/localStorage';

@Component({
  selector: 'app-enderecos',
  templateUrl: './enderecos.component.html',
  styleUrls: ['./enderecos.component.scss']
})
export class EnderecosComponent implements OnInit {

  @Output() refresh = new EventEmitter();
  @Input() pessoa: Observable<string[]>;
  _pessoaObject: any;
  enderecoExclusao: any;
  enderecoSelecionado: boolean;
  enderecoSelecionadoObject: any;
  private usuarioLogado: any;
  private enderecoForm: FormGroup;

  constructor(private connectHTTP: ConnectHTTP, private formBuilder: FormBuilder,
    private localStorage: LocalStorage,
    private toastrService: ToastService) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["pessoa"] && this.pessoa) {
      this.pessoa.subscribe(pessoa => {
        this._pessoaObject = pessoa
      });
    }
  }
  adicionarNovoEndereco() {
    if (this._pessoaObject && this._pessoaObject.principal.id) {
      this.enderecoForm = this.formBuilder.group({
        cep: ['', [Validators.required]],
        id_pessoa: [this._pessoaObject.principal.id],
        id_cidade: [''],
        cidade: [''],
        uf_cidade: [''],
        logradouro: [''],
        bairro: [''],
        complemento: ['', [Validators.required]],
        recebe_correspondencia: ['']
      });
      this.enderecoSelecionado = true;
    }
    else {
      this.toastrService.error('Necessário ter uma pessoa cadastrada!')
    }
  }

  async consultarCEP() {
    let cepConsulta = this.enderecoForm.value.cep.replace(/\D/g, '')
    if (!cepConsulta) return this.toastrService.error('Campo CEP vazio');

    var validacep = /^[0-9]{8}$/;
    if (validacep.test(cepConsulta)) {
      let cep = await this.connectHTTP.callService({
        host: 'https://viacep.com.br',
        service: '/ws/' + cepConsulta + '/json/unicode/'
      }) as any;
      const res = cep.resposta;
      this.enderecoForm = this.formBuilder.group({
        id: [(this.enderecoSelecionadoObject && this.enderecoSelecionadoObject.id) || ''],
        cep: [res.cep || this.enderecoForm.value.cep, [Validators.required]],
        id_pessoa: [this._pessoaObject.principal.id],
        id_cidade: [1],
        cidade: [res.localidade],
        uf_cidade: [res.uf],
        logradouro: [res.logradouro],
        bairro: [res.bairro],
        complemento: ['', [Validators.required]],
        recebe_correspondencia: [this.enderecoForm.value.recebe_correspondencia]
      });
    }
  }

  async setEnderecoDeCorrespondencia(endereco) {
    try {
      await this.connectHTTP.callService({
        service: 'editaEnderecoDeCorrespondencia',
        paramsService: {
          id_endereco: endereco.id,
          id_pessoa: endereco.id_pessoa
        }
      });
      this.toastrService.success('Endereço de correspondência alterado com sucesso!');
      this.refresh.emit();
    }
    catch (e) {
      this.toastrService.error('Endereço de correspondência não foi alterado');
    }

  }

  cancelarAdd() {
    this.enderecoSelecionado = false;
  }

  async salvar() {
    this.enderecoForm.value.cep = this.enderecoForm.value.cep.replace(/\D/g, '')
    try {
      await this.connectHTTP.callService({
        service: 'salvarEnderecoPessoa',
        paramsService: this.enderecoForm.value
      });
      this.toastrService.success('Salvo com sucesso');
    }
    catch (e) {
      this.toastrService.error('Erro ao salvar endereco');
    }
    this.refresh.emit();
    this.enderecoSelecionado = false;
  }



  excluirEndereco(enderecoId) {
    this.enderecoExclusao = this._pessoaObject.enderecos.filter(t => t.id == enderecoId)[0];
  }

  async confirmaExclusaoEndereco() {
    try {
      await this.connectHTTP.callService({
        service: 'excluirEnderecoPessoa',
        paramsService: {
          id_endereco: this.enderecoExclusao.id
        }
      });
      this.toastrService.success('Excluido com sucesso');
    }
    catch (e) {
      this.toastrService.error('Erro ao excluir telefone');
    }
    this.refresh.emit();
    this.enderecoExclusao = undefined;
  }
  cancelaExclusaoEndereco() {
    this.enderecoExclusao = undefined;
  }

  editarEndereco(enderecoId) {
    this.enderecoSelecionadoObject = this._pessoaObject.enderecos.filter(t => t.id == enderecoId)[0];
    this.enderecoForm = this.formBuilder.group({
      id: [this.enderecoSelecionadoObject.id],
      cep: [this.enderecoSelecionadoObject.cep],
      id_pessoa: [this._pessoaObject.principal.id],
      id_cidade: [this.enderecoSelecionadoObject.id_cidade],
      cidade: [this.enderecoSelecionadoObject.nome],
      uf_cidade: [this.enderecoSelecionadoObject.uf_cidade],
      logradouro: [this.enderecoSelecionadoObject.logradouro],
      bairro: [this.enderecoSelecionadoObject.bairro],
      complemento: [this.enderecoSelecionadoObject.complemento],
      recebe_correspondencia: [this.enderecoSelecionadoObject.recebe_correspondencia]
    });
    this.enderecoSelecionado = true;
  }
}
