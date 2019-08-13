import { ConnectHTTP } from '../shared/services/connectHTTP';
import { ToastService, MDBModalRef } from '../../lib/ng-uikit-pro-standard';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-classifcacao-de-clientes',
  templateUrl: './classifcacao-de-clientes.component.html',
  styleUrls: ['./classifcacao-de-clientes.component.scss']
})
export class ClassifcacaoDeClientesComponent implements OnInit {


  tableData: any;
  tableData_: any;
  private sorted = false;
  formularioTitulo: string;
  titleBntEnviar: string = 'Salvar';
  crud: string;

  formularioForm: FormGroup;
  formularioFormAud: any;

  constructor(
    private connectHTTP: ConnectHTTP,
    private toastrService: ToastService,
    private formBuilder: FormBuilder) {

      this.formularioForm = this.formBuilder.group({
        id:  [''],
        nome: [''],
        status: [''],
      });

     }

  ngOnInit() {

    this.getClassificacaoClientes();
    
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

  async getClassificacaoClientes() {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'getClassificacaoClientes',
        paramsService: {}
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.tableData = resp.resposta;
      }
    }
    catch (e) {
      
      this.toastrService.error('Erro ao ler classificação de clientes', e);
    }
  }

  adicionar(){
    this.formularioTitulo = 'Adicionando classificação de Clientes';
    this.formularioForm.controls['id'].setValue('');
    this.formularioForm.controls['nome'].setValue('');
    this.formularioForm.controls['status'].setValue(true);
    this.formularioForm.controls['id'].disable();
    this.formularioFormAud = this.formularioForm.value;
    this.titleBntEnviar = 'Salvar';
    this.crud = 'C'; // create  
  }

  editar(id){
    this.formularioTitulo = 'Editando classificação de Clientes';
    this.titleBntEnviar = 'Salvar';
    this.crud = 'U'; // update 
    this.povoarCampos(id);
    this.formularioForm.controls['id'].disable();
    this.formularioForm.controls['nome'].enable();
    this.formularioForm.controls['status'].enable();
    
  }

  excluir(id){
    this.formularioTitulo = 'Excluindo classificação de Clientes';
    this.titleBntEnviar = 'Excluir';
    this.crud = 'D'; // delete 
    this.povoarCampos(id);
    this.formularioForm.controls['id'].disable();
    this.formularioForm.controls['nome'].disable();
    this.formularioForm.controls['status'].disable();

  }

  povoarCampos(id){
    this.tableData_ = this.tableData.find(element => {
      if (element.id == id) return element;
    });
    this.formularioForm.controls['id'].setValue(this.tableData_.id);
    this.formularioForm.controls['nome'].setValue(this.tableData_.nome);
    this.formularioForm.controls['status'].setValue(this.tableData_.status);
    this.formularioForm.controls['id'].enable();
    this.formularioFormAud = this.formularioForm.value;
  }

  async salvar() {
    try {
      this.formularioForm.controls['id'].enable();
      this.formularioForm.controls['nome'].enable();
      this.formularioForm.controls['status'].enable();
      let resp = await this.connectHTTP.callService({
        service: 'crudClassificacaoClientes',
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

}


