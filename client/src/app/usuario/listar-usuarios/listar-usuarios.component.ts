import { TrocarSenhaComponent } from './../trocar-senha/trocar-senha.component';
import { Usuario } from './../../login/usuario';
import { Component, OnInit } from '@angular/core';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TabHeadingDirective } from 'ng-uikit-pro-standard';
import { controlNameBinding } from '@angular/forms/src/directives/reactive_directives/form_control_name';
import { UsuarioService } from '../usuario.service';
import SHA1 from  '../../shared/sha1';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.scss']
})
export class ListarUsuariosComponent implements OnInit {


  Usuario: {
    id: number;
    nomeSelec: string
  }
  usuario: Usuario;
  usuarioLogado: any;
  departamentos: Array<any>;
  departamentoSelect: Array<any>;
  departamentoIdSelect: number;
  usuarios: Array<any>;
  usuarioSelecionado: boolean = false;
  usuarioNomeSelecionado: string;
  usuarioIdSelecionado: number;
  sorted: boolean = false;
  departamentoNome: any;


    niveisHierarquicoSelect: Array<object> = [
    {
      value: 'M',
      label: "Membro"
    },
    {
      value: 'R',
      label: "Responsável"
    },
  ]

  usuarioForm: FormGroup;


  constructor(
    private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private formBuilder: FormBuilder,
    private toastrService: ToastService,
    private usuarioService : UsuarioService ) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.inicializaForm()
  }

  async ngOnInit() {
    

    let getDepartamentos = await this.connectHTTP.callService({
      service: 'getDepartamentos',
      paramsService: {
      }
    }) as any;
    
    this.departamentoSelect = getDepartamentos.resposta;
    this.departamentoSelect = this.departamentoSelect.filter(t => t.status);
    this.departamentoSelect = this.departamentoSelect.map(departamento => {
        return { value: departamento.id, label: departamento.nome }
      });
  


    this.getUsuarios();

  }

  async getUsuarios() {
    let getUsuarios = await this.connectHTTP.callService({
      service: 'getUsuarios',
      paramsService: {
      }
    }) as any;
    this.usuarios = getUsuarios.resposta;
    this.usuarioSelecionado = false;
  }

  inicializaForm(){
    
    this.usuarioForm = this.formBuilder.group({
      id: [''],
      login: [''],
      status: [true],
      nome: [{value:'', disabled: false } ],
      id_organograma: [''], 
      responsavel_membro: ['M'],
      hora_entrada: ['08:00'], 
      hora_saida: ['18:00'],      
      hora_entrada_lanche: ['12:00'],
      hora_saida_lanche: ['13:00'],
      possui_carteira_cli: [false],
      id_pessoa: [''],
      cpf_cnpj:[''],
      color_r:[54],
      color_g:[162],
      color_b:[235],
      dashboard:[''],
      senhaCriptogra:[SHA1('123')], 
    });
  }

  editar(usuarioId) {
    const usuarioSelecionado = this.usuarios.filter(t => t.id == usuarioId)[0];
    this.usuarioNomeSelecionado = usuarioSelecionado.nome;
    this.departamentoIdSelect = usuarioSelecionado.departamento;
    this.usuarioForm = this.formBuilder.group({
      id: [usuarioSelecionado.id],
      login: [usuarioSelecionado.login],
      status: [usuarioSelecionado.status],
      nome: [usuarioSelecionado.nome],
      id_organograma: [usuarioSelecionado.id_organograma], 
      responsavel_membro: [usuarioSelecionado.responsavel_membro],  
      hora_entrada: [usuarioSelecionado.hora_entrada], 
      hora_saida: [usuarioSelecionado.hora_saida], 
      hora_entrada_lanche: [usuarioSelecionado.hora_entrada_lanche], 
      hora_saida_lanche: [usuarioSelecionado.hora_saida_lanche], 
      possui_carteira_cli: [usuarioSelecionado.possui_carteira_cli],
      id_pessoa: [usuarioSelecionado.id_pessoa],
      senhaCriptogra: [usuarioSelecionado.senha]
    })

    this.usuarioSelecionado = true;
  }


  async salvar() {
    try {
      let resposta = await this.connectHTTP.callService({
        service: 'salvarUsuario',
        paramsService: this.usuarioForm.value
      });
      if (resposta.error) {
        this.toastrService.error(resposta.error);
      }else {
        this.toastrService.success('Salvo com sucesso');
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao salvar');
    }
    this.getUsuarios();
  }

  excluir(usuarioId){
    const usuarioSelecionado = this.usuarios.filter(t => t.id == usuarioId)[0];
    this.usuarioNomeSelecionado = usuarioSelecionado.nome;
    this.usuarioIdSelecionado = usuarioSelecionado.id;
  }

  async exclusaoConfirmada(){
    try {
      let resposta = await this.connectHTTP.callService({
        service: 'excluirUsuario',
        paramsService: 
        { id: this.usuarioIdSelecionado
        }
      });
      if (resposta.error){
        this.toastrService.error(resposta.error);
      }else {
        this.toastrService.success('Excluido com sucesso');
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao excluir');
    }
    this.getUsuarios();
  }



  sortBy(by: string | any): void {
    // if (by == 'dt_criou') {
    //   this.search().reverse();
    // } else {
    this.usuarios.sort((a: any, b: any) => {
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

  async getPessoaPorCPFCNPJ(){
    
      let getPessoaPorCPFCNPJ = await this.connectHTTP.callService({
      service: 'getPessoaPorCPFCNPJ',
      paramsService: {
        cpf_cnpj:  this.usuarioForm.value.cpf_cnpj // this.cpfCnpjPessoa
      }
    }) as any;
    if (getPessoaPorCPFCNPJ.resposta[0].id){
      this.usuarioForm.controls['id_pessoa'].setValue(getPessoaPorCPFCNPJ.resposta[0].id);
      this.usuarioForm.controls['nome'].reset({ value: getPessoaPorCPFCNPJ.resposta[0].nome , disabled: true });      
    // verifica se a pessoa já é usuário 
      const usuarioSelecionado = this.usuarios.filter(t => t.id_pessoa == getPessoaPorCPFCNPJ.resposta[0].id)[0];
      if (usuarioSelecionado) this.editar(usuarioSelecionado.id);
    }

  }

  async adicionar(){
    try {
      let resposta = await this.connectHTTP.callService({
        service: 'adicionarUsuario',
        paramsService: this.usuarioForm.value
      });
      if (resposta.error){
        this.toastrService.error(resposta.error);
      }else {
        this.toastrService.success('Adicionado com sucesso');
        this.getUsuarios();
        window.location.reload();
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao adicionar', e);
    }
  }

  campanhasUsuario(usuarioId){
    let usuarioSelecionado = this.usuarios.filter(t => t.id == usuarioId)[0];
    this.usuarioService.setUsuario( usuarioSelecionado );
    this.usuarioService.setAba(2);
  }

  permissoesUsuario(usuarioId){
    let usuarioSelecionado = this.usuarios.filter(t => t.id == usuarioId)[0];
    this.usuarioService.setUsuario( usuarioSelecionado );
    this.usuarioService.setAba(3);
  }

  inicializarSenha(){
    console.log(2,  this.usuarioForm.value.senhaCriptogra )
    this.usuarioForm.value.senhaCriptogra = SHA1('123');
    console.log(3,  this.usuarioForm.value.senhaCriptogra )
  }

  async getLogin(){
    try {
      let resposta = await this.connectHTTP.callService({
        service: 'getLogin',
        paramsService: { login: this.usuarioForm.value.login }
      });
      if (resposta.resposta){
          if (resposta.resposta[0].id){
            this.toastrService.error('Login já existente')
            this.toastrService.warning('Digite outro Login')
           }

      }
  }
  catch (e) {
    this.toastrService.error('Erro ao ler login', e);
  }

  }

}