import { async } from '@angular/core/testing';
import { EmailTemplate } from './email-template.model';
import { Injectable } from '@angular/core';
import { BancoDados } from '../shared/services/bancoDados';
import { ToastService } from '../../lib/ng-uikit-pro-standard';
import { ConnectHTTP } from '../shared/services/connectHTTP';

@Injectable({
  providedIn: 'root'
})
export class EmailTemplateService {

  emailTemplate: EmailTemplate[];

  constructor(
    private bancoDados: BancoDados = new BancoDados,
    private toastrService: ToastService,
    private connectHTTP: ConnectHTTP ) {
  }

   async read() {
    let resp  = await this.bancoDados.lerDados('getEmailTemplate', {}) as any;
    if ( resp.error != '')  
     { this.toastrService.error('Erro ao ler template de email ', resp.error )}
    return resp 
  } 

  async gravar(emailTemplate: EmailTemplate ) {
    console.log( 'emailTemplate g ', emailTemplate)
    try {
      await this.connectHTTP.sendFile({ 
          service: 'postEmailTemplate', 
          paramsService: { arquivo: emailTemplate }  
          })                  
        this.toastrService.success('Template salvo com sucesso!');
        return true;
    }catch (error) {
        console.log(error)
        this.toastrService.error('Template não salvo');
        return false;
    }

  }




}
