import { ConnectHTTP } from '../shared/services/connectHTTP';
import { ToastService, MDBModalRef } from '../../lib/ng-uikit-pro-standard';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BancoDados } from '../shared/services/bancoDados';

@Component({
  selector: 'app-parametros-interage',
  templateUrl: './parametros-interage.component.html',
  styleUrls: ['./parametros-interage.component.scss']
})
export class ParametrosInterageComponent implements OnInit {

  
    tableData: any;
    tableData_: any;
    private sorted = false;
    formularioTitulo: string;
    titleBntEnviar: string = 'Salvar';
    crud: string;
  
    formularioForm: FormGroup;
    formularioFormAud: any;

    paginators: Array<any> = [];
    activePage: number = 1;
    firstVisibleIndex: number = 1;
    lastVisibleIndex: number = 10;
    url: any = 'https://jsonplaceholder.typicode.com/posts';
    searchText: string;
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
  
    async getParametrosInterage() {
  

      let resp  = await this.bancoDados.lerDados('getParametrosInterage', {}) as any;
      
      console.log(resp)

      if (resp.resposta) 
         {this.tableData = resp.resposta; }
      else { this.toastrService.error('Erro ao ler Parâmetros do Interage', resp.error )}
  
    }
  
   
  
   
  
  
  
  
  
    async salvar() {
      try {
        this.formularioForm.controls['id'].enable();
        this.formularioForm.controls['nome'].enable();
        this.formularioForm.controls['status'].enable();
        let resp = await this.connectHTTP.callService({
          service: 'crudTipoClientes',
          paramsService: {
            dadosAtuais: JSON.stringify(this.formularioForm.value),
            dadosAnteriores: JSON.stringify(this.formularioFormAud),
            crud: this.crud
          }
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

    setParametroValor(valor, id){

      console.log('setParametroValor', valor, id)



    }
  
  }
  