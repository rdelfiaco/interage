
import { Proposta } from '../proposta';
import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ComunicaPropostaService } from '../comunica-proposta.service';



@Component({
  selector: 'app-ler-tabela-fipe',
  templateUrl: './ler-tabela-fipe.component.html',
  styleUrls: ['./ler-tabela-fipe.component.scss']
})
export class LerTabelaFipeComponent implements OnInit {

formulario: FormGroup;
proposta: Proposta = new Proposta();

// @Output() refresh = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private propostaComuc: ComunicaPropostaService,
    private aba: ComunicaPropostaService,
  ) { }

  ngOnInit() {

    this.formulario = this.formBuilder.group({
      tabelaFipe: [null],
      campo1: [null],
      campo2: [null],
      campo3: [null],
      campo4: [null],
      campo5: [null],
      campo6: [null],
      campo7: [null],
      campo8: [null]
      });

      //this.propostaComuc.emitiProposta.subscribe();
  
  }

  lerTabelaFipe(){


    let strTabelaFipe : string = this.formulario.get("tabelaFipe").value;
    let i, ij, j: number;
    let colunaDados : boolean;

    colunaDados = false;
    ij = 0;
    j = 1;

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

    this.propostaComuc.setProposta(this.proposta);
    
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

}