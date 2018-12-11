
import { Proposta } from '../proposta';
import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ComunicaPropostaService } from '../comunica-proposta.service';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';



@Component({
  selector: 'app-ler-tabela-fipe',
  templateUrl: './ler-tabela-fipe.component.html',
  styleUrls: ['./ler-tabela-fipe.component.scss']
})
export class LerTabelaFipeComponent implements OnInit {

formulario: FormGroup;



// @Output() refresh = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private propostaComuc: ComunicaPropostaService,
    private proposta: Proposta, 
    private aba: ComunicaPropostaService,
    private toastrService: ToastService
  ) { }

  ngOnInit() {

    this.formulario = this.formBuilder.group({
      tabelaFipe: [null],
      tabelaLimpa: [true],
      campo1: [null],
      campo2: [null],
      campo3: [null],
      campo4: [null],
      campo5: [null],
      campo6: [null],
      campo7: [null],
      campo8: [null]
      
      });

      this.propostaComuc.emitiProposta.subscribe(
        proposta => { 
          console.log('ler tabela fipe ', proposta )
          this.proposta = proposta;
          }
      );

      this.limparTabelaFipe()

  
  }

  lerTabelaFipe(){


    let strTabelaFipe : string = this.formulario.get("tabelaFipe").value;
    if (strTabelaFipe.length > 200){
      let i, ij, j: number;
      let colunaDados : boolean;
      colunaDados = false;
      ij = 0;
      j = 1;
      this.formulario.patchValue({tabelaLimpa : false });

      for (i = 0; i <  strTabelaFipe.length; i++)  {
          if (strTabelaFipe.charCodeAt(i) == 10 && strTabelaFipe.charCodeAt(i-1) == 10 ) {
            if (!colunaDados) {
              colunaDados = true;
              ij = i;
            } else {
              colunaDados = false;
              this.colocaConteudoCampo(j,strTabelaFipe.substr(ij+1,i-ij).trim());
              j++;
            }; 
          };
        };
      this.colocaConteudoCampo(j,strTabelaFipe.substr(ij+1,i-ij).trim());

      console.log( 'ler ', this.proposta)
      this.propostaComuc.setProposta(this.proposta);
  
      this.mudaAba()

  } else{
    this.toastrService.error('Dados incorretos! Favor clique no botão limpar e cole a tabela Fipe novamente');
    this.limparTabelaFipe();
    let i = 0;
    for (i = 1; i < 9; i++){
      this.colocaConteudoCampo(i,'')
    }
  }
    


  };

  
  colocaConteudoCampo(numeroCampo,conteudo){
    
    //this.formulario.patchValue({ '`campo${numeroCampo}`' : conteudo }) ;

    //eval(comando);

    switch (numeroCampo){
      case 1 :
        this.formulario.patchValue({campo1 : conteudo });
        this.proposta.mesReferencia = conteudo;
        break;
      case 2 :
        this.formulario.patchValue({campo2 : conteudo });
        this.proposta.codigoFipe = conteudo;
        break;
      case 3 :
        this.formulario.patchValue({campo3 : conteudo });
        this.proposta.marca = conteudo;
        break;
      case 4 :
        this.formulario.patchValue({campo4 : conteudo });
        this.proposta.modelo = conteudo;
        break;
      case 5 :
        this.formulario.patchValue({campo5 : conteudo });
        this.proposta.anoModelo = conteudo;
        break;
      case 6 :
        this.formulario.patchValue({campo6 : conteudo });
        this.proposta.autenticacao = conteudo;
        break;
      case 7 :
        this.formulario.patchValue({campo7 : conteudo });
        this.proposta.dataConsulta = conteudo;
        break;
      case 8 :
        this.formulario.patchValue({campo8 : conteudo });
        this.proposta.precoMedio = conteudo;
    }
  };

  mudaAba(){
    this.aba.setAba(4);
  }

  limparTabelaFipe(){
    this.formulario.patchValue({tabelaFipe : null });
    this.formulario.patchValue({tabelaLimpa : true });
    let placa = this.proposta.placa;  // para não perder a placa que foi digitado na aba pesquisa placa
    this.proposta = new Proposta();
    this.proposta.placa = placa;
    this.propostaComuc.setProposta(this.proposta);
     }

}