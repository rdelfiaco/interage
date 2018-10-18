import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { Usuario } from '../../login/usuario';

@Component({
  selector: 'app-trocar-senha',
  templateUrl: './trocar-senha.component.html',
  styleUrls: ['./trocar-senha.component.scss']
})
export class TrocarSenhaComponent implements OnInit {
  trocarSenhaForm: FormGroup;
  usuarioLogado: Usuario;

  constructor(private formBuilder: FormBuilder,
    private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private toastrService: ToastService) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.trocarSenhaForm = this.formBuilder.group({
      senhaAntiga: [''],
      senhaNova: [''],
      senhaNovaRepete: ['', [this.ValidateSenha.bind(this)]],
    })
  }
  ngOnInit() { }

  ValidateSenha(control: AbstractControl) {
    if (control.value === "" || control.value.length < 4) return { senhaDiferente: true };
    if (this.trocarSenhaForm && this.trocarSenhaForm.value.senhaNova !== control.value) return { senhaDiferente: true };
    else return null;
  }

  async salvarSenha() {
    this.trocarSenhaForm.value.id_usuario = this.usuarioLogado.id;
    this.trocarSenhaForm.value.token = this.usuarioLogado.token;
    try {
      let tratamento = await this.connectHTTP.callService({
        service: 'trocarSenhaUsuarioLogado',
        paramsService: this.trocarSenhaForm.value
      }) as any;
      this.toastrService.success('Senha alterado com sucesso!');
      this.trocarSenhaForm = this.formBuilder.group({
        senhaAntiga: [''],
        senhaNova: [''],
        senhaNovaRepete: ['', [this.ValidateSenha.bind(this)]],
      })
    }
    catch (e) {
      this.toastrService.error(e);
    }
  }

}
