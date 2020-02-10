import { ConnectHTTP } from '../shared/services/connectHTTP';
import { ToastService, MDBModalRef } from '../../lib/ng-uikit-pro-standard';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, HostListener } from '@angular/core';
import { BancoDados } from '../shared/services/bancoDados';

@Component({
  selector: 'app-parametros-interage',
  templateUrl: './parametros-interage.component.html',
  styleUrls: ['./parametros-interage.component.scss']
})
export class ParametrosInterageComponent implements OnInit {

  
    tableData: any;
    tableParametro: any
    tableData_: any;
    private sorted = false;
    formularioTitulo: string;
    titleBntEnviar: string = 'Salvar';
    crud: string;
    searchText: string;
    
    @HostListener('input') oninput() { this.pesquisar();}

  
    formularioForm: FormGroup;
    formularioFormAud: any;

    paginators: Array<any> = [];
    activePage: number = 1;
    firstVisibleIndex: number = 1;
    lastVisibleIndex: number = 10;
    url: any = 'https://jsonplaceholder.typicode.com/posts';
    firstPageNumber: number = 1;
    lastPageNumber: number;
    maxVisibleItems: number = 10;
  
    constructor(
      private connectHTTP: ConnectHTTP,
      private toastrService: ToastService,
      private formBuilder: FormBuilder,
      private bancoDados: BancoDados = new BancoDados) {
  
       }
  
    ngOnInit() {
  
      this.getParametrosInterage();
      
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


    filterIt(arr, valueToFind) {
      return arr.filter(function(obj) {
        return Object.keys(obj).some((key) => {
          if(['id','nome_parametro', 'descricao', ].includes(key) &&  obj[key] ){
              return obj[key].toString().includes(valueToFind);
          } else { 
              return false; 
          }
        });
      });
    };
  
    pesquisar() {
      if (!this.searchText) {
        this.tableData = this.tableParametro;
      } else {
        this.tableData =  this.filterIt(this.tableParametro, this.searchText);
      }
    }
  
    async getParametrosInterage() {
  

      let resp  = await this.bancoDados.lerDados('getParametrosInterage', {}) as any;
      
      if (resp.resposta) 
         {this.tableData = resp.resposta;
          this.tableParametro = resp.resposta; }
      else { this.toastrService.error('Erro ao ler Parâmetros do Interage', resp.error )}
    }

    async setParametroValor(id, valor ){

      let resp  = await this.bancoDados.lerDados('setParametrosInterages', {
        id_parametro: id,
        valor: valor
      }) as any;

      if (resp.error) {
        this.toastrService.error('Operação não realizada', resp.error );
    }else
    {
      this.toastrService.success('Operação realizada com sucesso');
    }
    this.ngOnInit();
    };


  
  }
  