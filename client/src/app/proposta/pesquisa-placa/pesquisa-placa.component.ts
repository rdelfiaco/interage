import { Proposta } from './../proposta';
import { Component, OnInit } from '@angular/core';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ComunicaPropostaService } from '../comunica-proposta.service';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { PlacaPipe } from '../../shared/pipes/placa/placa.pipe';
import { FormataDinheiroPipe } from '../../shared/pipes/mascaraDinheiro/formata-dinheiro.pipe';

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
    private mascaraPlaca: PlacaPipe,
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
        console.log('placa ', this.proposta)
      }
    );
  }

  async consultarPlaca(event: any) {

    let valorFormatado = this.mascaraPlaca.transform(event.target.value);
    this.formulario.controls['placa'].setValue(valorFormatado)
    if (this.mascaraPlaca.check(valorFormatado)) {
      try {
      let respPlacaConsultada = await this.connectHTTP.callService({
        service: 'consultarPlaca',
        paramsService: {
          placa: this.formulario.value.placa.replace('-', '')
        }
      });
      
      this.formulario.patchValue({ placaConsultada: JSON.stringify(respPlacaConsultada.resposta, null, 2) });
      if (JSON.stringify(respPlacaConsultada.resposta, null, 2).length < 10) {this.placaErrada()};
      this.proposta.placa = this.formulario.value.placa;
      this.propostaComuc.setProposta(this.proposta);
    
    }catch (error) {
      this.placaErrada()    
    }

      
    }
  }

  placaErrada() {

    this.formulario.patchValue({ placaConsultada: 'Veículo não encontrado' })
  }

}
