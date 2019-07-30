import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { ToastService, MDBModalRef } from '../../lib/ng-uikit-pro-standard';
import { LocalStorage } from '../shared/services/localStorage';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-pausa',
  templateUrl: './pausa.component.html',
  styleUrls: ['./pausa.component.scss']
})
export class PausaComponent implements OnInit {


  tableData: any;
  tableData_: any;
  private sorted = false;
  formularioTitulo: string;
  titleBntEnviar: string = 'Salvar';
  crud: string;

  formularioForm: FormGroup;
  formularioFormAud: any;

  constructor(
    private router: Router,
    private connectHTTP: ConnectHTTP,
    private toastrService: ToastService,
    private localStorage: LocalStorage,
    private formBuilder: FormBuilder) {

      this.formularioForm = this.formBuilder.group({
        id:  [''],
        nome: [''],
        tempo: [''],
        status: [''],
      });

     }

  ngOnInit() {

    this.getPausas();
    
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

  async getPausas() {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'getPausas',
        paramsService: {}
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.tableData = resp.resposta;
      }
    }
    catch (e) {
      
      this.toastrService.error('Erro ao ler as permissoes de pausa', e);
    }
  }

  adicionar(){
    this.formularioTitulo = 'Adicionando Pausa';
    this.formularioForm.controls['id'].setValue('');
    this.formularioForm.controls['nome'].setValue('');
    this.formularioForm.controls['tempo'].setValue('');
    this.formularioForm.controls['status'].setValue(true);
    this.formularioFormAud = this.formularioForm.value;
    this.titleBntEnviar = 'Salvar';
    this.crud = 'C'; // create  
  }

  editar(id){
    this.formularioTitulo = 'Editando Pausa';
    this.titleBntEnviar = 'Salvar';
    this.crud = 'U'; // update 
    this.povoarCampos(id);
    this.formularioForm.controls['id'].disable();
    this.formularioForm.controls['nome'].enable();
    this.formularioForm.controls['tempo'].enable();
    this.formularioForm.controls['status'].enable();
    
  }

  excluir(id){
    this.formularioTitulo = 'Excluindo Pausa';
    this.titleBntEnviar = 'Excluir';
    this.crud = 'D'; // delete 
    this.povoarCampos(id);
    this.formularioForm.controls['id'].disable();
    this.formularioForm.controls['nome'].disable();
    this.formularioForm.controls['tempo'].disable();
    this.formularioForm.controls['status'].disable();

  }

  povoarCampos(id){
    this.tableData_ = this.tableData.find(element => {
      if (element.id == id) return element;
    });
    this.formularioForm.controls['id'].setValue(this.tableData_.id);
    this.formularioForm.controls['nome'].setValue(this.tableData_.nome);
    this.formularioForm.controls['tempo'].setValue(this.tableData_.tempo);
    this.formularioForm.controls['status'].setValue(this.tableData_.status);
    this.formularioForm.controls['id'].enable();
    this.formularioFormAud = this.formularioForm.value;
  }

  async salvar() {
    try {
      this.formularioForm.controls['id'].enable();
      this.formularioForm.controls['nome'].enable();
      this.formularioForm.controls['tempo'].enable();
      this.formularioForm.controls['status'].enable();
      let resp = await this.connectHTTP.callService({
        service: 'crudPausa',
        paramsService: ({
          dadosAtuais: JSON.stringify(this.formularioForm.value),
          dadosAnteriores: JSON.stringify(this.formularioFormAud),
          crud: this.crud
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
