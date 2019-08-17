import { ConnectHTTP } from '../shared/services/connectHTTP';
import { ToastService, MDBModalRef } from '../../lib/ng-uikit-pro-standard';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-motivos-dos-eventos',
  templateUrl: './motivos-dos-eventos.component.html',
  styleUrls: ['./motivos-dos-eventos.component.scss']
})
export class MotivosDosEventosComponent implements OnInit {


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
        prazo_finalizacao: [''],
        gera_email: [''],
        acao_sql: [''],
        acao_js: [''],
        inicia_processo: [''],
      });

     }

  ngOnInit() {

    this.getMotivos();
    
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

  async getMotivos() {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'getMotivos',
        paramsService: {}
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.tableData = resp.resposta;
      }
    }
    catch (e) {
      
      this.toastrService.error('Erro ao ler motivos', e);
    }
  }

  adicionar(){
    this.formularioTitulo = 'Adicionando Motivos';
    this.formularioForm.controls['id'].setValue('');
    this.formularioForm.controls['nome'].setValue('');
    this.formularioForm.controls['status'].setValue(true);
    this.formularioForm.controls['prazo_finalizacao'].setValue('');
    this.formularioForm.controls['gera_email'].setValue(false);
    this.formularioForm.controls['acao_sql'].setValue('');
    this.formularioForm.controls['acao_js'].setValue('');
    this.formularioForm.controls['inicia_processo'].setValue(true);
    this.formularioForm.controls['id'].disable();
    this.formularioFormAud = this.formularioForm.value;
    this.titleBntEnviar = 'Salvar';
    this.crud = 'C'; // create  
  }

  editar(id){
    this.formularioTitulo = 'Editando Motivos';
    this.titleBntEnviar = 'Salvar';
    this.crud = 'U'; // update 
    this.povoarCampos(id);
    this.formularioForm.controls['id'].disable();
    this.formularioForm.controls['nome'].enable();
    this.formularioForm.controls['status'].enable();
    this.formularioForm.controls['prazo_finalizacao'].enable();
    this.formularioForm.controls['gera_email'].enable();
    this.formularioForm.controls['acao_sql'].enable();
    this.formularioForm.controls['acao_js'].enable();
    this.formularioForm.controls['inicia_processo'].enable();    
  }

  excluir(id){
    this.formularioTitulo = 'Excluindo Motivos';
    this.titleBntEnviar = 'Excluir';
    this.crud = 'D'; // delete 
    this.povoarCampos(id);
    this.formularioForm.controls['id'].disable();
    this.formularioForm.controls['nome'].disable();
    this.formularioForm.controls['status'].disable();
    this.formularioForm.controls['prazo_finalizacao'].disable();
    this.formularioForm.controls['gera_email'].disable();
    this.formularioForm.controls['acao_sql'].disable();
    this.formularioForm.controls['acao_js'].disable();
    this.formularioForm.controls['inicia_processo'].disable();    
  }

  povoarCampos(id){
    this.tableData_ = this.tableData.find(element => {
      if (element.id == id) return element;
    });
    this.formularioForm.controls['id'].setValue(this.tableData_.id);
    this.formularioForm.controls['nome'].setValue(this.tableData_.nome);
    this.formularioForm.controls['status'].setValue(this.tableData_.status);
    this.formularioForm.controls['prazo_finalizacao'].setValue(this.tableData_.prazo_finalizacao);
    this.formularioForm.controls['gera_email'].setValue(this.tableData_.gera_email);
    this.formularioForm.controls['acao_sql'].setValue(this.tableData_.acao_sql);
    this.formularioForm.controls['acao_js'].setValue(this.tableData_.acao_js);
    this.formularioForm.controls['inicia_processo'].setValue(this.tableData_.inicia_processo);
    this.formularioForm.controls['id'].enable();
    this.formularioFormAud = this.formularioForm.value;
  }

  async salvar() {
    try {
      this.formularioForm.controls['id'].enable();
      this.formularioForm.controls['nome'].enable();
      this.formularioForm.controls['status'].enable();
      this.formularioForm.controls['prazo_finalizacao'].enable();
      this.formularioForm.controls['gera_email'].enable();
      this.formularioForm.controls['acao_sql'].enable();
      this.formularioForm.controls['acao_js'].enable();
      this.formularioForm.controls['inicia_processo'].enable(); 
      let resp = await this.connectHTTP.callService({
        service: 'crudMotivos',
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



