import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent, ToastService, IMyOptions} from '../../lib/ng-uikit-pro-standard';
import { CrudCampanhaService } from './crud-campanha.service';
import { LocalStorage } from '../shared/services/localStorage';
import { Usuario } from '../login/usuario';
import { BancoDados } from '../shared/services/bancoDados';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';


@Component({
  selector: 'app-crud-campanha',
  templateUrl: './crud-campanha.component.html',
  styleUrls: ['./crud-campanha.component.scss']
})
export class CrudCampanhaComponent implements OnInit {

  @ViewChild('abasTabs') staticTabs: TabsetComponent;
  abaAtual: number;
  usuarioLogado: Usuario;
  canais: any;
  motivos: any;
  motivosDoCanal: any;
  canaisMotivos: any;  
  usuarios: any;
  questionarios: any;
  campanhas: any;
  campanhas_: any;
  campanhaUsuarios: any;
  sorted: boolean = false;



  formularioTitulo: string;
  titleBntEnviar: string = 'Salvar';
  crud: string;
  formularioForm: FormGroup;
  formularioFormAud: any;
  
  public myDatePickerOptions: IMyOptions = {
    dayLabels: { su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sab' },
    dayLabelsFull: { su: "Domingo", mo: "Segunda", tu: "Terça", we: "Quarta", th: "Quinta", fr: "Sexta", sa: "Sábado" },
    monthLabels: { 1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez' },
    monthLabelsFull: { 1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril", 5: "Maio", 6: "Junho", 7: "Julho", 8: "Agosto", 9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro" },

    // Buttons
    todayBtnTxt: "Hoje",
    clearBtnTxt: "Limpar",
    closeBtnTxt: "Fechar",
    closeAfterSelect: true,
    dateFormat: 'dd/mm/yyyy',
  }

   constructor(  
      private service : CrudCampanhaService = new CrudCampanhaService, 
      private localStorage: LocalStorage,
      private bancoDados: BancoDados = new BancoDados,
      private formBuilder: FormBuilder,
      private toastrService: ToastService) {

        this.formularioForm = this.formBuilder.group({
          id:  [''],
          nome: [''],
          descricao: [''],
          dt_inicio: [''],
          dt_fim: [''],
          script: [''],
          sql_destinatarios: [''],
          status: [''],
          id_canal: [''],
          id_motivo: [''],
          id_questionario: [''],
        });
      this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
      this.service.abaAtual = 1;
   }

  async ngOnInit() {
    this.campanhas = await this.bancoDados.lerDados('getCampanhas', {}) as any;
    if (!this.campanhas.resposta) 
    {
      this.toastrService.error('Erro ao ler campanha');
      return 
    }
    this.campanhas = this.campanhas.resposta;
    this.staticTabs.setActiveTab( this.service.abaAtual )
    this.service.emitiAba.subscribe(
      abaA => { 
                this.staticTabs.setActiveTab(abaA);
                this.abaAtual = abaA}
    )

    this.motivos = await this.bancoDados.lerDados('getMotivos', {}) as any;
    if (!this.motivos) {
      this.toastrService.error('Erro ao ler motivos');
      return
    } 
    this.motivos = this.motivos.resposta;

    this.canais = await this.bancoDados.lerDados('getCanais', {}) as any;
    if (!this.canais){
      this.toastrService.error('Erro ao ler canais');
      return
    }
    this.canais = this.canais.resposta;

    this.canaisMotivos = await this.bancoDados.lerDados('getCanaisMotivos', {}) as any;
    if(!this.canais){
      this.toastrService.error('Erro ao ler canais motivos');
      return;
    }
    this.canaisMotivos = this.canaisMotivos.resposta;

    this.canais =  this.canais.filter((r) => {if (r.status) return true }).map((c: any) => {
      return { value: c.id, label: c.nome }
    }); 

    this.questionarios = await this.bancoDados.lerDados('getQuestionarios',{}) as any;
    if(!this.questionarios){
      this.toastrService.error('Erro ao ler questionário');
      return;
    }
    this.questionarios = this.questionarios.resposta;
    this.questionarios = this.questionarios.filter((r) => { if (r.status) return true}).map((c: any) => {
      return { value: c.id, label: c.nome}
    });

  }

  async usuariosCampanha(campanhaId ){
    this.service.campanhaSelecionadoAtual = this.campanhas.filter(t => t.id == campanhaId)[0];
    this.service.abaAtual = 2;
  }


  sortBy(by: string | any): void {
    // if (by == 'dt_criou') {
    //   this.search().reverse();
    // } else {
      this.campanhas.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }
      return 0;
    });
    //}
    this.sorted = !this.sorted;
  }


  adicionar(){
    this.formularioTitulo = 'Adicionando campanha';
    this.formularioForm.controls['id'].setValue('');
    this.formularioForm.controls['nome'].setValue('');
    this.formularioForm.controls['status'].setValue(true);
    this.formularioForm.controls['descricao'].setValue('');
    this.formularioForm.controls['dt_inicio'].setValue('');
    this.formularioForm.controls['dt_fim'].setValue('');
    this.formularioForm.controls['script'].setValue('');
    this.formularioForm.controls['sql_destinatarios'].setValue('');
    this.formularioForm.controls['id_canal'].setValue('');
    this.formularioForm.controls['id_motivo'].setValue('');
    this.formularioForm.controls['id_questionario'].setValue('');
    this.formularioForm.controls['id'].disable();
    this.formularioFormAud = this.formularioForm.value;
    this.titleBntEnviar = 'Salvar';
    this.crud = 'C'; // create  
  }

  editar(id){
    this.formularioTitulo = 'Editando campanha';
    this.titleBntEnviar = 'Salvar';
    this.crud = 'U'; // update 
    this.povoarCampos(id);
    this.formularioForm.controls['id'].disable();
    this.formularioForm.controls['nome'].enable();
    this.formularioForm.controls['status'].enable();
    this.formularioForm.controls['descricao'].enable();
    this.formularioForm.controls['dt_inicio'].enable();
    this.formularioForm.controls['dt_fim'].enable();
    this.formularioForm.controls['script'].enable();
    this.formularioForm.controls['sql_destinatarios'].enable();
    this.formularioForm.controls['id_canal'].enable();
    this.formularioForm.controls['id_motivo'].enable();
    this.formularioForm.controls['id_questionario'].enable();

  }

  excluir(id){
    this.formularioTitulo = 'Excluindo campanha';
    this.titleBntEnviar = 'Excluir';
    this.crud = 'D'; // delete 
    this.povoarCampos(id);
    this.formularioForm.controls['id'].disable();
    this.formularioForm.controls['nome'].disable();
    this.formularioForm.controls['status'].disable();
    this.formularioForm.controls['descricao'].disable();
    this.formularioForm.controls['dt_inicio'].disable();
    this.formularioForm.controls['dt_fim'].disable();
    this.formularioForm.controls['script'].disable();
    this.formularioForm.controls['sql_destinatarios'].disable();
    this.formularioForm.controls['id_canal'].disable();
    this.formularioForm.controls['id_motivo'].disable();
    this.formularioForm.controls['id_questionario'].disable();
  }

  povoarCampos(id){
    this.campanhas_ = this.campanhas.find(element => {
      if (element.id == id) return element;
    });
    this.formularioForm.controls['id'].setValue(this.campanhas_.id);
    this.formularioForm.controls['nome'].setValue(this.campanhas_.nome);
    this.formularioForm.controls['status'].setValue(this.campanhas_.status);
    this.formularioForm.controls['descricao'].setValue(this.campanhas_.descricao);
    this.formularioForm.controls['dt_inicio'].setValue(moment(this.campanhas_.dt_inicio ).format('DD/MM/YYYY') );
    this.formularioForm.controls['dt_fim'].setValue(moment(this.campanhas_.dt_fim).format('DD/MM/YYYY'));
    this.formularioForm.controls['script'].setValue(this.campanhas_.script);
    this.formularioForm.controls['sql_destinatarios'].setValue(this.campanhas_.sql_destinatarios);
    this.formularioForm.controls['id_canal'].setValue(this.campanhas_.id_canal);
    this.formularioForm.controls['id_motivo'].setValue(this.campanhas_.id_motivo);
    this.formularioForm.controls['id_questionario'].setValue(this.campanhas_.id_questionario);

    this.formularioForm.controls['id'].enable();
    this.getMotivosDoCanal({value: this.campanhas_.id_canal});
    this.formularioFormAud = this.formularioForm.value;
  }

  async salvar() {

    this.formularioForm.controls['id'].enable();
    this.formularioForm.controls['nome'].enable();
    this.formularioForm.controls['status'].enable();
    this.formularioForm.controls['descricao'].enable();
    this.formularioForm.controls['dt_inicio'].enable();
    this.formularioForm.controls['dt_fim'].enable();
    this.formularioForm.controls['script'].enable();
    this.formularioForm.controls['sql_destinatarios'].enable();
    this.formularioForm.controls['id_canal'].enable();
    this.formularioForm.controls['id_motivo'].enable();
    this.formularioForm.controls['id_questionario'].enable();

    let resposta  = await this.bancoDados.salvaDados('crudCampanha',
    { dadosAtuais: JSON.stringify(this.formularioForm.value),
      dadosAnteriores: JSON.stringify(this.formularioFormAud),
      crud: this.crud}) as any;

    if (resposta.error) {this.toastrService.error('Erro ao realizar a solicitação');}
    else {this.toastrService.success(`Realizado com sucesso`);}

    this.ngOnInit();
  }

  getMotivosDoCanal(canal){

    this.motivosDoCanal =  this.canaisMotivos.filter((r) => {
      if (r.id_canal == canal.value) return true })

    let motivosDoCanal_ = [];
    this.motivosDoCanal = this.motivosDoCanal.forEach(e => {
       this.motivos.filter((r) => { if(r.id == e.id_motivo && r.status) return true}).map(( c: any) => { 
        motivosDoCanal_.push( { value: c.id, label: c.nome} )
      }) 
    });
    this.motivosDoCanal = motivosDoCanal_;

    if (this.motivosDoCanal.length < 1 ) this.toastrService.error('O canal selecionado não possui motivo');

  }

}
