import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';

@Component({
  selector: 'app-questionario-add',
  templateUrl: './questionario-add.component.html',
  styleUrls: ['./questionario-add.component.scss']
})
export class QuestionarioAddComponent implements OnInit {
  private questionarioForm: FormGroup;
  usuarioLogado: any;
  constructor(private connectHTTP: ConnectHTTP, private formBuilder: FormBuilder,
    private localStorage: LocalStorage,
    private toastrService: ToastService) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;
  }

  ngOnInit() {
  }

  novoQuestionario() {
    this.questionarioForm = this.formBuilder.group({
      nome: [''],
      status: [''],
    });
  }

  async salvar() {
    // this.enderecoForm.value.cep = this.enderecoForm.value.cep.replace(/\D/g, '')
    // try {
    //   let resp = await this.connectHTTP.callService({
    //     service: 'salvarEnderecoPessoa',
    //     paramsService: this.enderecoForm.value
    //   });

    //   if (resp.error) {
    //       this.toastrService.error('Erro ao salvar endereco');
    //   }else
    //   {
    //     this.toastrService.success('Salvo com sucesso');
    //   }
    // }
    // catch (e) {
    //   this.toastrService.error('Erro ao salvar endereco');
    // }
    // this.refresh.emit();
    // this.enderecoSelecionado = false;
  }
}
