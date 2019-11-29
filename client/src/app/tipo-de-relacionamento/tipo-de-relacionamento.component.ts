import { Component, OnInit } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { ToastService } from '../../lib/ng-uikit-pro-standard';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BancoDados } from '../shared/services/bancoDados';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tipo-de-relacionamento',
  templateUrl: './tipo-de-relacionamento.component.html',
  styleUrls: ['./tipo-de-relacionamento.component.scss']
})
export class TipoDeRelacionamentoComponent implements OnInit {



  tableData: any;
  tableData_: any;
  private sorted = false;
  formularioTitulo: string;
  titleBntEnviar: string = 'Salvar';
  crud: string;

  formularioForm: FormGroup;
  formularioFormAud: any;

  nivelRelacionamento = [
    {
      value: 'P',
      label: 'Profissinal'
    },
    {
      value: 'F',
      label: 'Familiar'
    }
  ];


  constructor(
    private connectHTTP: ConnectHTTP,
    private router: Router,
    private toastrService: ToastService,
    private formBuilder: FormBuilder,
    private bancoDados: BancoDados = new BancoDados) {

      
      this.formularioForm = this.formBuilder.group({
        id:  [''],
        descricao: [''],
        nivelrelacionamento: [''],
        status: [''],
      });

     }

  ngOnInit() {

    this.getTipoClientes();
    
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

  async getTipoClientes() {

    let resp  = await this.bancoDados.lerDados('getTipoRelacionamentosCon', {}) as any;
    
    if (resp.resposta) 
       {this.tableData = resp.resposta; 
       console.log('this.tableData ', this.tableData ) 
       }
    else { this.toastrService.error('Erro ao ler tipo de relacionamentos', resp.error )}

  }

  adicionar(){
    this.formularioTitulo = 'Adicionando Tipo de Relacionamento';
    this.formularioForm.controls['id'].setValue('');
    this.formularioForm.controls['descricao'].setValue('');
    this.formularioForm.controls['nivelrelacionamento'].setValue('');
    this.formularioForm.controls['status'].setValue(true);
    this.formularioForm.controls['id'].disable();
    this.formularioFormAud = this.formularioForm.value;
    this.titleBntEnviar = 'Salvar';
    this.crud = 'C'; // create  
  }

  editar(id){
    this.formularioTitulo = 'Editando Tipo de Relacionamento';
    this.titleBntEnviar = 'Salvar';
    this.crud = 'U'; // update 
    this.povoarCampos(id);
    this.formularioForm.controls['id'].disable();
    this.formularioForm.controls['descricao'].enable();
    this.formularioForm.controls['nivelrelacionamento'].enable();
    this.formularioForm.controls['status'].enable();
    
  }

  excluir(id){
    this.formularioTitulo = 'Excluindo Tipo de Relacionamento';
    this.titleBntEnviar = 'Excluir';
    this.crud = 'D'; // delete 
    this.povoarCampos(id);
    this.formularioForm.controls['id'].disable();
    this.formularioForm.controls['descricao'].disable();
    this.formularioForm.controls['nivelrelacionamento'].disable();
    this.formularioForm.controls['status'].disable();

  }

  povoarCampos(id){
    this.tableData_ = this.tableData.find(element => {
      if (element.id == id) return element;
    });
    this.formularioForm.controls['id'].setValue(this.tableData_.id);
    this.formularioForm.controls['descricao'].setValue(this.tableData_.descricao);
    this.formularioForm.controls['nivelrelacionamento'].setValue(this.tableData_.nivelrelacionamento);
    this.formularioForm.controls['status'].setValue(this.tableData_.status);
    this.formularioForm.controls['id'].enable();
    this.formularioFormAud = this.formularioForm.value;
  }

  async salvar() {
    try {
      this.formularioForm.controls['id'].enable();
      this.formularioForm.controls['descricao'].enable();
      this.formularioForm.controls['nivelrelacionamento'].enable();
      this.formularioForm.controls['status'].enable();
      let resp = await this.connectHTTP.callService({
        service: 'crudTipoRelacionamentos',
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
  };

  getSelectedValuePrioridade() {}

  relacionamentoVolta(id: any , descricao: any ){

    this.router.navigate([`relacionamentoVolta/{"idTipoDeRelac":${id},"descriTipoDeRelac":"${descricao}"}`]);


  }


}


