import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { Usuario } from '../../login/usuario';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-telefones',
  templateUrl: './telefones.component.html',
  styleUrls: ['./telefones.component.scss']
})
export class TelefonesComponent implements OnInit {

  private telefoneSelecionado: boolean;
  _pessoa: any
  _pessoaObject: any;
  telefoneExclusao: any;
  @Output() refresh = new EventEmitter();

  @Input() pessoa: Observable<string[]>;

  private tipoTelefone: Observable<Array<object>>;
  private usuarioLogado: any;
  private telefoneForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private toastrService: ToastService) {
    this.telefoneForm = this.formBuilder.group({
      id: [''],
      id_pessoa: [''],
      ddd: [''],
      telefone: [''],
      ramal: [''],
      principal: [''],
      id_tipo_telefone: [''],
      contato: [''],
      ddi: ['']
    });

    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
  }

  async ngOnInit() {
    let tipoTelefone = await this.connectHTTP.callService({
      service: 'getTipoTelefone',
      paramsService: {
        token: this.usuarioLogado.token,
        id_usuario: this.usuarioLogado.id,
      }
    });
    this.tipoTelefone = new Observable((observer) => {
      let tel = tipoTelefone.resposta as Array<object>
      tel = tel.map((c: any) => {
        return { value: c.id, label: c.descricao }
      })
      observer.next(tel)
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["pessoa"] && this.pessoa) {
      this.pessoa.subscribe(pessoa => {
        this._pessoaObject = pessoa
      });
    }
  }

  adicionarNovoTelefone() {
    if (this._pessoaObject && this._pessoaObject.principal.id) {
      this.telefoneForm = this.formBuilder.group({
        id: [''],
        id_pessoa: [this._pessoaObject.principal.id, [Validators.required]],
        ddd: ['', [Validators.required]],
        telefone: ['', [Validators.required]],
        ramal: [''],
        principal: [false],
        id_tipo_telefone: ['', [Validators.required]],
        contato: [''],
        ddi: ['']
      })
      this.telefoneSelecionado = true;
    }
    else {
      this.toastrService.error('Necessário ter uma pessoa cadastrada!')
    }
  }

  excluirTelefone(telefoneId) {
    this.telefoneExclusao = this._pessoaObject.telefones.filter(t => t.id == telefoneId)[0];
  }
  async confirmaExclusaoTelefone() {
    try {
      await this.connectHTTP.callService({
        service: 'excluirTelefonePessoa',
        paramsService: {
          id_usuario: this.usuarioLogado.id,
          token: this.usuarioLogado.token,
          id_telefone: this.telefoneExclusao.id
        }
      });
      this.toastrService.success('Excluido com sucesso');
    }
    catch (e) {
      this.toastrService.error('Erro ao excluir telefone');
    }
    this.refresh.emit();
    this.telefoneExclusao = undefined;
  }
  cancelaExclusaoTelefone() {
    this.telefoneExclusao = undefined;
  }

  editarTelefone(telefoneId) {
    const telefoneSelecionado = this._pessoaObject.telefones.filter(t => t.id == telefoneId)[0];
    this.telefoneForm = this.formBuilder.group({
      id: [telefoneSelecionado.id],
      id_pessoa: [this._pessoaObject.principal.id, [Validators.required]],
      ddd: [telefoneSelecionado.ddd, [Validators.required]],
      telefone: [telefoneSelecionado.telefone, [Validators.required]],
      ramal: [telefoneSelecionado.ramal],
      principal: [false],
      id_tipo_telefone: [telefoneSelecionado.id_tipo_telefone, [Validators.required]],
      contato: [telefoneSelecionado.contato],
      ddi: [telefoneSelecionado.ddi]
    })
    this.telefoneSelecionado = true;
  }

  cancelarAdd() {
    this.telefoneSelecionado = false;
  }
  async salvar() {
    this.telefoneForm.value.id_usuario = this.usuarioLogado.id;
    this.telefoneForm.value.token = this.usuarioLogado.token;
    try {
      await this.connectHTTP.callService({
        service: 'salvarTelefonePessoa',
        paramsService: this.telefoneForm.value
      });
      this.toastrService.success('Salvo com sucesso');
    }
    catch (e) {
      this.toastrService.error('Erro ao salvar telefone');
    }
    this.refresh.emit();
    this.telefoneSelecionado = false;
  }
}
