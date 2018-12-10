import { Proposta } from './../proposta';
import { Component, OnInit } from '@angular/core';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ComunicaPropostaService } from '../comunica-proposta.service';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';

@Component({
  selector: 'app-pesquisa-placa',
  templateUrl: './pesquisa-placa.component.html',
  styleUrls: ['./pesquisa-placa.component.scss']
})
export class PesquisaPlacaComponent implements OnInit {
 
  formulario: FormGroup;
  


  constructor(private connectHTTP: ConnectHTTP, 
              private localStorage: LocalStorage,
              private formBuilder: FormBuilder,
              private propostaComuc: ComunicaPropostaService,
              private proposta: Proposta,
              private aba: ComunicaPropostaService,
              private toastrService: ToastService) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      placa: [null],
      placaConsultada: [null]
    });


      this.propostaComuc.emitiProposta.subscribe(
        proposta => { 
          //this.proposta = proposta;
          console.log('placa ', this.proposta )
          }
      );

  }

  async consultarPlaca(evento) {
    
    if (event.keyCode === 13) {
      debugger
      // let respPlacaConsultada = await this.connectHTTP.callService({
      //   service: 'consultarPlaca',
      //   paramsService: {
      //     placa: this.formulario.value.placa.replace('-','')
      //   }
      // }) as any;
      
      
      // this.formulario.patchValue( {placaConsultada: respPlacaConsultada.resposta});
      this.proposta.placa = this.formulario.value.placa;
      this.propostaComuc.setProposta(this.proposta);
      
      //console.log(respPlacaConsultada.resposta)
    }
  }

}
