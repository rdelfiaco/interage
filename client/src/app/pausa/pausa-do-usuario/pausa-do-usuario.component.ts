import { Component, OnInit } from '@angular/core';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';

@Component({
  selector: 'app-pausa-do-usuario',
  templateUrl: './pausa-do-usuario.component.html',
  styleUrls: ['./pausa-do-usuario.component.scss']
})
export class PausaDoUsuarioComponent implements OnInit {

  pausaSelect: Array<any>;
  pausaSelectValue: number = 1;
  enableBtnInicio: boolean = false;
  enableBtnFim: boolean = false;
  enableBtnPausa: boolean = true;
  id_pausa_usuario: number;

  constructor(
    private connectHTTP: ConnectHTTP,
    private toastrService: ToastService,
   ) {



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


        console.log(this.pausaSelect)

      }
    }
    catch (e) {
      
      this.toastrService.error('Erro ao ler as permissoes de pausa', e);
    }
  }

  onChangePausa(){
    this.enableBtnInicio = true
  }

  async registrarInicio(){
      try {
        let resp = await this.connectHTTP.callService({
          service: 'registrarInicioPausa',
          paramsService: ({
            id_pausa: this.pausaSelectValue
          }) 
        });
        if (resp.error) {
            this.toastrService.error('Operação não realizada', resp.error );
        }else
        {
          console.log(resp.resposta)
          this.id_pausa_usuario = resp.resposta[0].id
          this.toastrService.success('Operação realizada com sucesso');
          this.enableBtnFim = true;
          this.enableBtnPausa = false;
          this.enableBtnInicio = false;
        }
      }
      catch (e) {
        this.toastrService.error('Operação não realizada');
      }
      this.ngOnInit();
    }

  async registrarFim(){
    try {
      let resp = await this.connectHTTP.callService({
        service: 'registrarFimPausa',
        paramsService: ({
          id_pausa_usuario: this.id_pausa_usuario
        }) 
      });
      if (resp.error) {
          this.toastrService.error('Operação não realizada', resp.error );
      }else
      {
        this.toastrService.success('Operação realizada com sucesso');
      }
    }
    catch (e) {
      this.toastrService.error('Operação não realizada');
    }
    this.ngOnInit();
  
  }


}
