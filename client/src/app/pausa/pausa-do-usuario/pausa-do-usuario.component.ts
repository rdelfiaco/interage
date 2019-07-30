import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { ToastService, PAUSE } from '../../../lib/ng-uikit-pro-standard';
import { LocalStorage } from '../../shared/services/localStorage';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pausa-do-usuario',
  templateUrl: './pausa-do-usuario.component.html',
  styleUrls: ['./pausa-do-usuario.component.scss']
})
export class PausaDoUsuarioComponent implements OnInit {

  private formularioForm: FormGroup;
  pausaSelect: Array<any>;
  pausaSelectValue: number;

  constructor(
    private router: Router,
    private connectHTTP: ConnectHTTP,
    private toastrService: ToastService,
    private localStorage: LocalStorage,
    private formBuilder: FormBuilder) {

      this.formularioForm = this.formBuilder.group({
        id:  [''],
        nome: [''],
        tempo: [''],
        status: [''],
      });

     }

  ngOnInit() {

    this.getPausas();

  }
  async getPausas() {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'getPausas',
        paramsService: {}
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {

        this.pausaSelect = resp.resposta.map(pausa => {
          return { value: pausa.id, label: pausa.nome, tempo: pausa.tempo }
        });

        this.pausaSelectValue = 1; 

        console.log(this.pausaSelect)

      }
    }
    catch (e) {
      
      this.toastrService.error('Erro ao ler as permissoes de pausa', e);
    }
  }

  onChangePausa(){
    
  }
}
