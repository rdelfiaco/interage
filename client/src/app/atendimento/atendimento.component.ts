import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { ToastService, ModalDirective } from '../../lib/ng-uikit-pro-standard';
import { LocalStorage } from '../shared/services/localStorage';
import { Usuario } from '../login/usuario';
import { BancoDados } from '../shared/services/bancoDados';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import validaCpf from '../shared/validaCpf';

@Component({
  selector: 'app-atendimento',
  templateUrl: './atendimento.component.html',
  styleUrls: ['./atendimento.component.scss']
})
export class AtendimentoComponent implements OnInit {

  usuarioLogado: Usuario;
  protocolo: number = 0;
  ddd: number = 62;
  telefone: string;
  paginators: Array<any> = [];
  activePage: number = 1;
  firstVisibleIndex: number = 1;
  lastVisibleIndex: number = 10;
  tableData = [];
  tableDataCliente = [];
  sorted = false;
  searchText: string;
  firstPageNumber: number = 1;
  lastPageNumber: number;
  maxVisibleItems: number = 10;  
  idEvento: number;
  idEventoPai: number;
  checkAbreEvento: boolean = false;
  buscaCliente: boolean = false;
  dddTelefone: any;
  checkCriaEvento: boolean = false;
  eventoAnterior: number;
  eventoAnteriorProtocolo: number;
  idCliente: number;
  tituloModal: string;
  habilitaButton: boolean = true;

  tipoPessoaSelecionada: string = 'F';
  pessoaForm: FormGroup;

  @ViewChild('modalAbreEvento') modalAbreEvento: ModalDirective;
  @ViewChild('modalBuscaCliente') modalBuscaCliente: ModalDirective;
  @ViewChild('modalCriaEvento') modalCriaEvento: ModalDirective;


  constructor(private http: Http, 
    private connectHTTP: ConnectHTTP,
    private toastrService: ToastService, 
    private localStorage: LocalStorage,
    private bancoDados: BancoDados = new BancoDados,
    private router: Router,
    private formBuilder: FormBuilder
    ) { 
      this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
      this.pessoaForm = this.formBuilder.group({
        id_pessoa: [''],
        nome: [{value:'', disabled: true}, Validators.compose([
          Validators.required])],
        cpf_cnpj: ['', Validators.compose([
          Validators.required   ])]
      });
    
    }

  async ngOnInit() {
    let resp = await this.bancoDados.lerDados('getIdEvento',{}) as any;
    if(!resp || resp.error) 
     {
      this.toastrService.error('Erro ao ler protocolo ');
      return;
    }
    this.protocolo = resp.resposta.idEvento;

    return;
  }

  async pesquisar(){
    

    if (this.telefone && this.ddd){
     this.dddTelefone = `(${this.ddd}) ${this.telefone}`
    let resp = await this.bancoDados.lerDados('getEventosTelefone',{dddTelefone: this.dddTelefone }) as any;
    if(!resp || resp.error) 
     {
      this.toastrService.error('Erro ao ler protocolo ');
      this.tableData = [];
      return;
    }
    this.tableData = resp.resposta as Array<object>;

     resp = await this.bancoDados.lerDados('getPessoasEventosDoTelefone',
        { ddd: this.ddd,
          telefone: this.telefone 
        }) as any;
    if(!resp || resp.error) 
      {
      this.toastrService.error('Erro ao consultar pessoa   ');
      return;
      };

    this.tableDataCliente = resp.resposta as Array<object>;



    if(!this.tableData[0].id && !this.tableDataCliente[0].id){
      this.tableData = [];
      this.tableDataCliente = [];
      this.toastrService.info('Não foi encontrado nenhum atendimento anterior para o telefone informado');
      return;
    }

    let tem : boolean;
    this.tableDataCliente.forEach( pessoas => {
      tem = false
      this.tableData.forEach( (elem, index) => {
        if (!elem.id) {
          this.tableData.splice(index, 1)
        }
        if (elem.id == pessoas.id && pessoas.id != null ) { tem = true}
      }) 
      if (!tem) {
        if (pessoas.id) {
          this.tableData.push({ 
            id: pessoas.id, 
            dt_criou: pessoas.dt_criou ,
            cliente: pessoas.nome_cliente,
            id_pessoa_receptor: pessoas.id_cliente,
            motivo: pessoas.motivo,
            observacao_origem: pessoas.observacao_origem,
            status: pessoas.status,
            id_telefone: pessoas.id_telefone_pessoa,
            id_evento_pai: pessoas.id_evento_pai
            }) 
        } else {
          this.tableData.push({ 
            cliente: pessoas.nome_cliente,
            id_pessoa_receptor: pessoas.id_cliente,
            })
        }
       }
      });
      this.defineNumeroPagina();
      // console.log('this.tableData' , this.tableData );
      // console.log('this.tableDataCliente ', this.tableDataCliente );
      return;
  }else {
    this.toastrService.error('Favor informar o ddd e o telefone  ');
  }

  }
  defineNumeroPagina(){
    this.paginators = [];
    for (let i = 1; i <= this.search().length; i++) {
      if (!(this.paginators.indexOf(Math.ceil(i / this.maxVisibleItems)) !== -1)) {
        this.paginators.push(Math.ceil(i / this.maxVisibleItems));
      }
    }
    this.lastPageNumber = this.paginators.length;
  }

  changePage(event: any) {
    if (event.target.text >= 1 && event.target.text <= this.maxVisibleItems) {
      this.activePage = +event.target.text;
      this.firstVisibleIndex = this.activePage * this.maxVisibleItems - this.maxVisibleItems + 1;
      this.lastVisibleIndex = this.activePage * this.maxVisibleItems;
    }
  }

  nextPage() {
    this.activePage += 1;
    this.firstVisibleIndex = this.activePage * this.maxVisibleItems - this.maxVisibleItems + 1;
    this.lastVisibleIndex = this.activePage * this.maxVisibleItems;
  }
  previousPage() {
    this.activePage -= 1;
    this.firstVisibleIndex = this.activePage * this.maxVisibleItems - this.maxVisibleItems + 1;
    this.lastVisibleIndex = this.activePage * this.maxVisibleItems;
  }

  firstPage() {
    this.activePage = 1;
    this.firstVisibleIndex = this.activePage * this.maxVisibleItems - this.maxVisibleItems + 1;
    this.lastVisibleIndex = this.activePage * this.maxVisibleItems;
  }

  lastPage() {
    this.activePage = this.lastPageNumber;
    this.firstVisibleIndex = this.activePage * this.maxVisibleItems - this.maxVisibleItems + 1;
    this.lastVisibleIndex = this.activePage * this.maxVisibleItems;
  }

  sortBy(by: string | any): void {
    // if (by == 'dt_criou') {
    //   this.search().reverse();
    // } else {
    this.tableData.sort((a: any, b: any) => {
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

  filterIt(arr: any, searchKey: any) {
    return arr.filter((obj: any) => {
      return Object.keys(obj).some((key) => {
        return obj[key].includes(searchKey);
      });
    });
  }

  search() {

    if (!this.searchText) {
      return this.tableData;
    }

    if (this.searchText) {
      return this.filterIt(this.tableData, this.searchText);
    }
  }


  async abreEvento(evento: any) {
    if (evento.id) {
    this.checkAbreEvento = true;
    this.idEvento = evento.id;
    if (evento.id_status_evento == 1 || evento.id_status_evento == 4) {
      let resp = await this.bancoDados.lerDados('visualizarEvento',
              {            id_evento: evento.id,
                id_pessoa_visualizou: this.usuarioLogado.id_pessoa }) as any;
      if(!resp || resp.error) 
       {
        this.toastrService.error('Erro ao abrir o evento  ');
        return;
       };
      };
        this.modalAbreEvento.show();
    }

  }

  novoAtendimentoPessoa(){

    if (this.telefone && this.ddd){
        this.dddTelefone = `(${this.ddd}) ${this.telefone}`
        this.buscaCliente = true;
        this.modalBuscaCliente.show();
      } else{
        this.toastrService.error('Favor informar o ddd e o telefone  ');
       }
  };

  novoAtendimento(idCliente: number ){
     if (this.telefone && this.ddd){
      this.checkCriaEvento = true;
      this.eventoAnterior = null;
      this.eventoAnteriorProtocolo= this.protocolo
      this.tituloModal = 'Registro de um novo atendimento do protocolo:'
      this.modalCriaEvento.show(); 
      this.idCliente = idCliente;
     } else{
      this.toastrService.error('Favor informar o ddd e o telefone  ');
     }
  }

  async novoAtendimentoPessoaInformada(){
    if (!this.pessoaForm.valid) {
      this.toastrService.error('CPF ou Nome invalido  ');
      return false;
    }
    if (this.telefone && this.ddd){
      if(!this.pessoaForm.value.id_pessoa) {
        
        let resp = await this.connectHTTP.callService({
          service: 'adicionarPessoaAtendimento',
          paramsService: {
            cpf_cnpj:  this.pessoaForm.value.cpf_cnpj, 
            nome:  this.pessoaForm.value.nome,
            ddd: this.ddd,
            telefone: this.telefone
          }
        }) as any;
        if (!resp.resposta.idPessoa){
          this.toastrService.error('Erro ao cadastrar a pessoa');
          return false
        }
        this.pessoaForm.controls['id_pessoa'].setValue(resp.resposta.idPessoa);
      }
     this.checkCriaEvento = true;
     this.eventoAnterior = null;
     this.eventoAnteriorProtocolo= this.protocolo
     this.tituloModal = 'Registro de um novo atendimento do protocolo:'
     this.idCliente = this.pessoaForm.value.id_pessoa;
     this.modalCriaEvento.show(); 
    } else{
     this.toastrService.error('Favor informar o ddd e o telefone  ');
    }
 }

 informacaoDoAtendimento(eventoAnterior: number, idEventoPai: number,  idCliente: number ){
    this.checkCriaEvento = true;
    this.eventoAnterior = eventoAnterior;
    this.eventoAnteriorProtocolo = eventoAnterior;
    this.idEventoPai = idEventoPai;
    this.tituloModal = 'Informação do atendimento do protocolo: '
    this.modalCriaEvento.show(); 
    this.idCliente = idCliente;
  }

  fechaModal() {
    this.modalCriaEvento.hide();
    this.modalBuscaCliente.hide();
  }

  async getPessoaPorCPFCNPJ(){
      // verifica se a pessoa já é usuário 
    let getPessoaPorCPFCNPJ = await this.connectHTTP.callService({
      service: 'getPessoaPorCPFCNPJ',
      //service: 'buscaPessoa',
      paramsService: {
      cpf_cnpj:  this.pessoaForm.value.cpf_cnpj, // this.cpfCnpjPessoa
      ddd: this.ddd,
      telefone: this.telefone
    }
  }) as any;

  
  if (getPessoaPorCPFCNPJ.error != '') {
    this.pessoaForm.value.cpf_cnpj = this.pessoaForm.value.cpf_cnpj && this.pessoaForm.value.cpf_cnpj.replace(/\W/gi, '')
    if (!validaCpf.isValid(this.pessoaForm.value.cpf_cnpj)) {
      this.pessoaForm.controls['nome'].reset({ value: '' , disabled: true });  
      this.pessoaForm.controls['nome'].setValue('');
      this.toastrService.error('Informe um CPF válido');
      return false;
    }
    this.pessoaForm.controls['nome'].reset({ value: '' , disabled: false }); 
    this.pessoaForm.controls['nome'].setValue('');
    return true;
  }

  if (getPessoaPorCPFCNPJ.resposta[0]){
      this.pessoaForm.controls['id_pessoa'].setValue(getPessoaPorCPFCNPJ.resposta[0].id);
      this.pessoaForm.controls['nome'].reset({ value: getPessoaPorCPFCNPJ.resposta[0].nome , disabled: true });      
    }else {
      this.pessoaForm.controls['id_pessoa'].setValue(getPessoaPorCPFCNPJ.resposta.idPessoa);
      this.pessoaForm.controls['nome'].reset({ value: getPessoaPorCPFCNPJ.resposta.nome , disabled: true });          
  }

  return true;

}

corrigiTelefone(){
  this.telefone = this.telefone.trim().replace(/\W/gi, '');
  this.habilitaButton = false
}

}
