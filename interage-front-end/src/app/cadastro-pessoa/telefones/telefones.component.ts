import { Component, OnInit, Input } from '@angular/core';
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

  private telefones: Array<any> = [];
  private telefoneSelecionado: boolean;
  _pessoa: any
  @Input() refresh: any

  @Input()
  set pessoa(pessoa: any) {
    this._pessoa = pessoa;
    this.telefones = pessoa.telefones;
  }

  get pessoa(): any {
    return this._pessoa
  }

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

  adicionarNovoTelefone() {
    this.telefoneForm = this.formBuilder.group({
      id: [''],
      id_pessoa: [this.pessoa.principal.id, [Validators.required]],
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
    this.refresh();
    this.telefoneSelecionado = false;
  }
}
