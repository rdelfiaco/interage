import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { UsuarioService } from '../../usuario/usuario.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-motivos-respostas',
  templateUrl: './motivos-respostas.component.html',
  styleUrls: ['./motivos-respostas.component.scss']
})
export class MotivosRespostasComponent implements OnInit {


  respostas: any;
  respostasMotivo: any; 
  idMotivoSelecionado: any;
  sorted: boolean = false;
  nomeMotivoSelecionado: any;

  tableData: any;
  tableData_: any;
  formularioTitulo: string;
  titleBntEnviar: string = 'Salvar';
  crud: string;
 
  formularioForm: FormGroup;
  formularioFormAud: any;



  constructor(  private usuarioService : UsuarioService,
    private connectHTTP: ConnectHTTP,
    private toastrService: ToastService,
    private _location: Location,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,

  ) { 

    this.route.params.subscribe(res => {
      let _res = res.id;
      _res =  JSON.parse(_res);
      this.idMotivoSelecionado = _res.idMotivo
      this.nomeMotivoSelecionado = _res.nomeMotivo
    });

    this.formularioForm = this.formBuilder.group({
      id:  [''],
      nome: [''],
      status: [''],
      idMotivo: [this.idMotivoSelecionado],
      exige_predicao: [''],
      exige_observacao: [''],
      exige_objecao: [''],
      exige_proposta: [''],
      id_questionaio: [''],
      id_prioridade: [''],
      ordem_listagem: [''],
      acao_sql: [''],
      acao_js: [''],
      tentativas: ['']
    });


   }

ngOnInit() {

    this.getRespostasMotivoSeleconado();
    
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

  async getRespostasMotivoSeleconado() {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'getRespostasMotivoSeleconado',
        paramsService: {
          idMotivoSelecionado: this.idMotivoSelecionado
        }
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.tableData = resp.resposta;
      }
    }
    catch (e) {
      
      this.toastrService.error('Erro ao ler respostas do motivo', e);
    }
  }

  adicionar(){
    this.formularioTitulo = `Adicionando resposta do motivo : ${this.nomeMotivoSelecionado}`;
    this.formularioForm.controls['id'].setValue('');
    this.formularioForm.controls['nome'].setValue('');
    this.formularioForm.controls['status'].setValue(true);
    this.formularioForm.controls['idMotivo'].setValue(this.idMotivoSelecionado);
    this.formularioForm.controls['id'].disable();
    this.formularioFormAud = this.formularioForm.value;
    this.titleBntEnviar = 'Salvar';
    this.crud = 'C'; // create  
  }

  editar(id){
    this.formularioTitulo = `Editando resposta do motivo : ${this.nomeMotivoSelecionado}`;
    this.titleBntEnviar = 'Salvar';
    this.crud = 'U'; // update 
    this.povoarCampos(id);
    this.formularioForm.controls['id'].disable();
    this.formularioForm.controls['nome'].enable();
    this.formularioForm.controls['status'].enable();
    this.formularioForm.controls['idMotivo'].setValue(this.idMotivoSelecionado);


    
  }

  excluir(id){
    this.formularioTitulo = `Excluindo resposta do motivo : ${this.nomeMotivoSelecionado}`;
    this.titleBntEnviar = 'Excluir';
    this.crud = 'D'; // delete 
    this.povoarCampos(id);
    this.formularioForm.controls['id'].disable();
    this.formularioForm.controls['nome'].disable();
    this.formularioForm.controls['status'].disable();
    this.formularioForm.controls['idMotivo'].setValue(this.idMotivoSelecionado);

  }

  povoarCampos(id){
    this.tableData_ = this.tableData.find(element => {
      if (element.id == id) return element;
    });
    this.formularioForm.controls['id'].setValue(this.tableData_.id);
    this.formularioForm.controls['nome'].setValue(this.tableData_.nome);
    this.formularioForm.controls['status'].setValue(this.tableData_.status);
    this.formularioForm.controls['exige_predicao'].setValue(this.tableData_.exige_predicao);
    this.formularioForm.controls['exige_observacao'].setValue(this.tableData_.exige_observacao);
    this.formularioForm.controls['exige_objecao'].setValue(this.tableData_.exige_objecao);
    this.formularioForm.controls['exige_proposta'].setValue(this.tableData_.exige_proposta);
    this.formularioForm.controls['id_questionaio'].setValue(this.tableData_.id_questionaio);
    this.formularioForm.controls['id_prioridade'].setValue(this.tableData_.id_prioridade);
    this.formularioForm.controls['ordem_listagem'].setValue(this.tableData_.ordem_listagem);
    this.formularioForm.controls['tentativas'].setValue(this.tableData_.tentativas);
    this.formularioForm.controls['acao_sql'].setValue(this.tableData_.acao_sql);
    this.formularioForm.controls['acao_js'].setValue(this.tableData_.acao_js);
    this.formularioForm.controls['id'].enable();
    this.formularioForm.controls['idMotivo'].setValue(this.idMotivoSelecionado);
    this.formularioFormAud = this.formularioForm.value;
  }

  async salvar() {
    try {
      this.formularioForm.controls['id'].enable();
      this.formularioForm.controls['nome'].enable();
      this.formularioForm.controls['status'].enable();
      let resp = await this.connectHTTP.callService({
        service: 'crudRespostasMotivo',
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

  goBack(){
    this._location.back();
  }
  
}
