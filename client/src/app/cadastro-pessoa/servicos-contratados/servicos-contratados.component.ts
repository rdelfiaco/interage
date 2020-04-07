import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-servicos-contratados',
  templateUrl: './servicos-contratados.component.html',
  styleUrls: ['./servicos-contratados.component.scss']

})


export class ServicosContratadosComponent implements OnInit {

  
  @Output() refresh = new EventEmitter();
  @Input() pessoa: Observable<string[]>;
  
  _pessoaObject: any;
  tableData: any;
  sorted: any;

  
  constructor() { 

  }


  ngOnInit() {
    

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["pessoa"] && this.pessoa) {
      this.pessoa.subscribe(pessoa => {
        this._pessoaObject = pessoa;
        this.tableData = this._pessoaObject.associadoContratos; 
        debugger
        for (var i = 0; i < this.tableData.length ; i++){
          switch(this.tableData[i].situacao_financeira) {
            case 'ADIMPLENTE':
                if (this.tableData[i].descricao_situacao_veiculo == "PÓS-VENDA" || this.tableData[i].descricao_situacao_veiculo == "ATIVO" ){
                  this.tableData[i].corLinha = 'verde' 
                }else {
                  this.tableData[i].corLinha = 'vermelho'
                }
              
              break;
            case 'INADIMPLENTE':
                if (this.tableData[i].descricao_situacao_veiculo == "INADIMPLENTE" || this.tableData[i].descricao_situacao_veiculo == "ATIVO" ){
                  this.tableData[i].corLinha = 'laranja' 
                }else {
                  this.tableData[i].corLinha = 'vermelho'
                }
              break;

            default:
              this.tableData[i].corLinha = ''

        }

        }

      });
    }
  }

  sortBy(by: string | any): void {

    this.tableData.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }
      return 0;
    });
    this.sorted = !this.sorted;
  }


  
}
