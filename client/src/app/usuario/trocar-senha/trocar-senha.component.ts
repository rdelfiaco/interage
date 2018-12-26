import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { Usuario } from '../../login/usuario';
import SHA1 from '../../shared/sha1';

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
    this.trocarSenhaForm.value.senhaAntiga = SHA1(this.trocarSenhaForm.value.senhaAntiga);
    this.trocarSenhaForm.value.senhaNova = SHA1(this.trocarSenhaForm.value.senhaNova);
    this.trocarSenhaForm.value.senhaNovaRepete = SHA1(this.trocarSenhaForm.value.senhaNovaRepete);
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
