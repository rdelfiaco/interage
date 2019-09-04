import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { UsuarioService } from '../../usuario/usuario.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-motivos-eventos-automaticos',
  templateUrl: './motivos-eventos-automaticos.component.html',
  styleUrls: ['./motivos-eventos-automaticos.component.scss']
})
export class MotivosEventosAutomaticosComponent implements OnInit {

  respostas: any;
  respostasMotivo: any; 
  questionarios: any;
  prioridades: any;
  motivos: any;
  canais: any;
  departamentos: any;
  usuarios: any;
  gera_para: Array<object>;
  tipodestino: Array<object>;

  idRespostaSelecionada: any;
  nomeRespostaSelecionada: any;

  tableData: any;
  tableData_: any;
  sorted: boolean = false;

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
    private router: Router,

  ) { 

    this.route.params.subscribe(res => {
      let _res = res.id;
      _res =  JSON.parse(_res);
      this.idRespostaSelecionada = _res.idResposta
      this.nomeRespostaSelecionada = _res.nomeResposta
    });

    this.formularioForm = this.formBuilder.group({
      id:  [''],
      id_motivo_resposta: [this.idRespostaSelecionada],
      id_motivo: [''],
      id_canal: [''],
      gera_para: [''],
      tipodestino: [''],
      id_pessoa_organograma: [''],
      id_prioridade: [''],
      observacao_origem: [''],
      prazo_para_exibir: [''],
      reagendar: [''],
    });


   }

ngOnInit() {

    this.getMotivosRespostasAutomaticas();
    
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

  async getMotivosRespostasAutomaticas() {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'getMotivosRespostasAutomaticas',
        paramsService: {
          idRespostaSelecionada: this.idRespostaSelecionada
        }
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {

        console.log('resp.resposta', resp.resposta)
        this.tableData = resp.resposta.eventosAutomaticoMotivo;
        this.motivos = resp.resposta.motivos as Array<object>;
        this.prioridades = resp.resposta.prioridade as Array<object>;
        this.canais = resp.resposta.canais as Array<object>;
        this.departamentos = resp.resposta.departamentos as Array<object>;
        this.usuarios = resp.resposta.usuarios as Array<object>;
        
        this.canais =  this.canais.filter((r) => {if (r.status) return true }).map((c: any) => {
          return { value: c.id, label: c.nome }
        });        
        this.departamentos =  this.departamentos.filter((r) => {if (r.status) return true }).map((c: any) => {
          return { value: c.id, label: c.nome }
        }); 
        this.motivos =  this.motivos.filter((r) => {if (r.status) return true }).map((c: any) => {
          return { value: c.id, label: c.nome }
        }); 
        this.prioridades =  this.prioridades.filter((r) => {if (r.status) return true }).map((c: any) => {
          return { value: c.id, label: c.nome }
        }); 
        this.usuarios =  this.usuarios.filter((r) => {if (r.status) return true }).map((c: any) => {
          return { value: c.id, label: c.nome }
        }); 

        this.tipodestino = []
        this.tipodestino.push({ value: 1, label: 'Usuário', tipodestino: 'P'})
        this.tipodestino.push({ value: 2, label: 'Departamento', tipodestino: 'O'})

        this.gera_para = []
        this.gera_para.push({ value: 1, label: 'Usuário fixo'})
        this.gera_para.push({ value: 2, label: 'Usuário que encerrou evento'})
        this.gera_para.push({ value: 3, label: 'Usuário que atende o cliente'})
        this.gera_para.push({ value: 4, label: 'Usuário que criou o evento que está sendo encerrado'})

      }
    }
    catch (e) {
      
      this.toastrService.error('Erro ao ler informações para criar eventos automáticos', e);
    }
  }

  adicionar(){
    this.formularioTitulo = `Adicionando informações para gerar evento da resposta: ${this.nomeRespostaSelecionada}`;
    this.formularioForm.controls['id'].setValue('');
    this.formularioForm.controls['id_motivo_resposta'].setValue(this.idRespostaSelecionada);
    this.formularioForm.controls['id_motivo'].setValue('');
    this.formularioForm.controls['id_canal'].setValue('');
    this.formularioForm.controls['gera_para'].setValue('');
    this.formularioForm.controls['tipodestino'].setValue('');
    this.formularioForm.controls['id_pessoa_organograma'].setValue('');
    this.formularioForm.controls['id_prioridade'].setValue('');
    this.formularioForm.controls['observacao_origem'].setValue('');
    this.formularioForm.controls['prazo_para_exibir'].setValue('');
    this.formularioForm.controls['reagendar'].setValue('');
    this.formularioForm.controls['id'].disable();
    this.formularioFormAud = this.formularioForm.value;
    this.titleBntEnviar = 'Salvar';
    this.crud = 'C'; // create  
  }

  editar(id){
    this.formularioTitulo = `Editando informações para gerar evento da resposta: ${this.nomeRespostaSelecionada}`;
    this.titleBntEnviar = 'Salvar';
    this.crud = 'U'; // update 
    this.povoarCampos(id);
    this.formularioForm.controls['id'].disable();
    this.formularioForm.controls['id_motivo_resposta'].disable();
    this.formularioForm.controls['id_motivo'].enable();
    this.formularioForm.controls['id_canal'].enable();
    this.formularioForm.controls['gera_para'].enable();
    this.formularioForm.controls['tipodestino'].enable();
    this.formularioForm.controls['id_pessoa_organograma'].enable();
    this.formularioForm.controls['id_prioridade'].enable();
    this.formularioForm.controls['observacao_origem'].enable();
    this.formularioForm.controls['prazo_para_exibir'].enable();
    this.formularioForm.controls['reagendar'].enable();
  }

  excluir(id){
    this.formularioTitulo = `Excluindo informações para gerar evento da resposta: ${this.nomeRespostaSelecionada}`;
    this.titleBntEnviar = 'Excluir';
    this.crud = 'D'; // delete 
    this.povoarCampos(id);
    this.formularioForm.controls['id'].disable();
    this.formularioForm.controls['id_motivo_resposta'].disable();
    this.formularioForm.controls['id_motivo'].disable();
    this.formularioForm.controls['id_canal'].disable();
    this.formularioForm.controls['gera_para'].disable();
    this.formularioForm.controls['tipodestino'].disable();
    this.formularioForm.controls['id_pessoa_organograma'].disable();
    this.formularioForm.controls['id_prioridade'].disable();
    this.formularioForm.controls['observacao_origem'].disable();
    this.formularioForm.controls['prazo_para_exibir'].disable();
    this.formularioForm.controls['reagendar'].disable();

  }

  povoarCampos(id){
    this.tableData_ = this.tableData.find(element => {
      if (element.id == id) return element;
    });
    this.formularioForm.controls['id'].setValue(this.tableData_.id);
    this.formularioForm.controls['id_motivo_resposta'].setValue(this.idRespostaSelecionada);
    this.formularioForm.controls['id_motivo'].setValue(this.tableData_.id_motivo);
    this.formularioForm.controls['id_canal'].setValue(this.tableData_.id_canal);
    this.formularioForm.controls['gera_para'].setValue(this.tableData_.gera_para);
    this.formularioForm.controls['tipodestino'].setValue(this.tableData_.tipodestino);
    this.formularioForm.controls['id_pessoa_organograma'].setValue(this.tableData_.id_pessoa_organograma);
    this.formularioForm.controls['id_prioridade'].setValue(this.tableData_.id_prioridade);
    this.formularioForm.controls['observacao_origem'].setValue(this.tableData_.observacao_origem);
    this.formularioForm.controls['prazo_para_exibir'].setValue(this.tableData_.prazo_para_exibir);
    this.formularioForm.controls['reagendar'].setValue(this.tableData_.reagendar);

    this.formularioFormAud = this.formularioForm.value;
  }

  async salvar() {
    try {

      this.formularioForm.controls['id'].enable();
      this.formularioForm.controls['id_motivo_resposta'].enable();
      this.formularioForm.controls['id_motivo'].enable();
      this.formularioForm.controls['id_canal'].enable();
      this.formularioForm.controls['gera_para'].enable();
      this.formularioForm.controls['tipodestino'].enable();
      this.formularioForm.controls['id_pessoa_organograma'].enable();
      this.formularioForm.controls['id_prioridade'].enable();
      this.formularioForm.controls['observacao_origem'].enable();
      this.formularioForm.controls['prazo_para_exibir'].enable();
      this.formularioForm.controls['reagendar'].enable();

      let resp = await this.connectHTTP.callService({
        service: 'crudEventoAutomativoRespostaMotivo',
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
  
  eventosAutomaticos(id, nome){

    this.router.navigate([`motivosEventosAutomaticos/{"idMotivo":${id},"nomeMotivo":"${nome}"}`]);

  }

  getSelectedValueQuestionario(id){

  }
  getSelectedValuePrioridade(id){
    
  }
}

