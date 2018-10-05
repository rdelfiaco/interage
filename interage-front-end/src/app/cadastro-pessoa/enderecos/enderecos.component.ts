import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { FormGroup, FormBuilder } from '@angular/forms';
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
        cep: [''],
        id_pessoa: [''],
        id_cidade: [''],
        cidade: [''],
        logradouro: [''],
        bairro: [''],
        complemento: [''],
        recebe_correspondencia: ['']
      });
      this.enderecoSelecionado = true;
    }
    else {
      this.toastrService.error('Necessário ter uma pessoa cadastrada!')
    }
  }

  async consultarCEP() {
    let cep = await this.connectHTTP.callService({
      host: 'http://apps.widenet.com.br',
      service: '/busca-cep/api/cep.json',
      paramsService: {
        code: 74525030
      }
    }) as any;
    cep = cep.resposta;
    this.enderecoForm = this.formBuilder.group({
      cep: [cep.code],
      id_pessoa: [this._pessoaObject.principal.id],
      id_cidade: [1],
      cidade: [cep.city],
      logradouro: [cep.address],
      bairro: [cep.district],
      complemento: [''],
      recebe_correspondencia: [false]
    });
  }

  cancelarAdd() {
    this.enderecoSelecionado = false;
  }

  async salvar() {
    this.enderecoForm.value.id_usuario = this.usuarioLogado.id;
    this.enderecoForm.value.token = this.usuarioLogado.token;
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
          id_usuario: this.usuarioLogado.id,
          token: this.usuarioLogado.token,
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
    const enderecoSelecionado = this._pessoaObject.enderecos.filter(t => t.id == enderecoId)[0];
    this.enderecoForm = this.formBuilder.group({
      id: [enderecoSelecionado.id],
      cep: [enderecoSelecionado.cep],
      id_pessoa: [this._pessoaObject.principal.id],
      id_cidade: [enderecoSelecionado.id_cidade],
      cidade: [enderecoSelecionado.cidade],
      logradouro: [enderecoSelecionado.logradouro],
      bairro: [enderecoSelecionado.bairro],
      complemento: [enderecoSelecionado.complemento],
      recebe_correspondencia: [enderecoSelecionado.recebe_correspondencia]
    });
    this.enderecoSelecionado = true;
  }
}
