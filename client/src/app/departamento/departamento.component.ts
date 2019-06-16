import { Component, OnInit } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { Router } from '@angular/router';
import { ToastService } from '../../lib/ng-uikit-pro-standard';
import { Usuario } from '../login/usuario';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.scss']
})
export class DepartamentoComponent implements OnInit {

  usuarioLogado: any;
  departamentos: Array<any>;
  usuarios: Array<any>;
  departamentosVaule: Array<any>
  sorted: boolean = false;
  usuariosDepartamento: Array<any>;
  departamentoNome: any;
  permissoesDepartamento: Array<any>;
  departamentoIdSelecionado: number;
  permissoes: any;
  permissoesDepart: any; 
  departSelecionado: object;
  source: Array<any>;
  targe:  Array<any>;
  disabledVoltar: boolean = true;

  novoFormato =  { add: 'Adicionar', 
                  remove: 'Remover', 
                  all: 'Selecionar todos', 
                  none: 'Desfazer a seleção', 
                  direction: 'left-to-right', 
                  draggable: true, 
                  locale: undefined }

  constructor(
    private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private toastrService: ToastService ) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;

  }

  async ngOnInit() {
    let getDepartamentos = await this.connectHTTP.callService({
      service: 'getDepartamentos',
      paramsService: {
      }
    }) as any;

    this.departamentos = getDepartamentos.resposta;

  }


  sortBy(by: string | any): void {
    // if (by == 'dt_criou') {
    //   this.search().reverse();
    // } else {
      this.departamentos.sort((a: any, b: any) => {
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

  sortByU(by: string | any): void {
    // if (by == 'dt_criou') {
    //   this.search().reverse();
    // } else {
      this.usuariosDepartamento.sort((a: any, b: any) => {
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

  async getPermissoesDepartamento(departamentoIdSelecionado, departamentoNome){

    this.departamentoNome = departamentoNome;
    this.departamentoIdSelecionado = departamentoIdSelecionado

      try {
        let resp = await this.connectHTTP.callService({
          service: 'getPermissoesDepartamentoSeleconado',
          paramsService: {
            id: departamentoIdSelecionado
          }
        }) as any;
  
        if (resp.error){
          this.toastrService.error(resp.error);
        }else {
          this.permissoes = resp.resposta.permissoes; 
          this.permissoesDepartamento = resp.resposta.permissoesDepartamento; 
          this.povoaVetoresDepartamento()
        }
      }
      catch (e) {
        this.toastrService.error('Erro ao ler as permissoes do departamento', e);
      }
    }


    povoaVetoresDepartamento(){
      this.targe = [];
      this.source = [];
      this.permissoes.forEach( element => {
        let registro = 
                {
                  _id: element.id ,
                  _name: element.nome,
                }
       this.source.push( registro );
      });
      this.permissoesDepartamento.forEach(element => {
        let registro = 
                {
                  _id: element.id_recursos ,
                  _name: element.nome,
                }
       this.targe.push( registro );
      });
      // sort dos vetores 
      let by = '_name'
      this.source.sort((a: any, b: any) => {
                    if (a[by] < b[by]) {
                      return this.sorted ? 1 : -1;
                    }
                    if (a[by] > b[by]) {
                      return this.sorted ? -1 : 1;
                    }
                    return 0;
                  });
      this.targe.sort((a: any, b: any) => {
        if (a[by] < b[by]) {
          return this.sorted ? 1 : -1;
        }
        if (a[by] > b[by]) {
          return this.sorted ? -1 : 1;
        }
        return 0;
      });
  
  
      if ( this.permissoesDepartamento[0].nome == null ) this.targe = [];
      if ( this.permissoes[0].nome == null ) this.source = []; 
      
    }

    async salvarPermissoesDoDepartamento(){
      this.disabledVoltar = false
        try {
          let resposta = await this.connectHTTP.callService({
            service: 'salvarPermissoesDoDepartamento',
            paramsService: {
              departamentoIdSelecionado: this.departamentoIdSelecionado ,
              permissoesDoDepartamento: JSON.stringify(this.targe)
            }
          }) 
          if (resposta.error){
            this.toastrService.error(resposta.error);
          }else {
            this.toastrService.success('Salvo com sucesso');
          }
        }
        catch (e) {
          this.toastrService.error('Erro ao salvar');
        }
        
      }




  async getUsuariosdoDepartamento(departamentoIdSelecionado, departamentoNome){

    this.departamentoNome = departamentoNome;
    this.departamentoIdSelecionado = departamentoIdSelecionado
    debugger
      try {
        let resp = await this.connectHTTP.callService({
          service: 'getUsuarios',
          paramsService: {
          }
        }) as any;
  
        if (resp.error){
          this.toastrService.error(resp.error);
        }else {
          this.usuarios = resp.resposta; 
          this.usuarios = this.usuarios.filter( e => e.status);
          this.usuariosDepartamento =  this.usuarios.filter( e => e.id_organograma == departamentoIdSelecionado );
          this.povoaVetoresUsuarios()
        }
      }
      catch (e) {
        this.toastrService.error('Erro ao ler usuários', e);
      }
    }
      
      
  povoaVetoresUsuarios(){
    this.targe = [];
    this.source = [];
    this.usuarios.forEach( element => {
      let registro = 
              {
                _id: element.id ,
                _name: element.nome,
              }
      this.source.push( registro );
    });

    if (this.usuariosDepartamento.length > 0){
      this.usuariosDepartamento.forEach(element => {
        let registro = 
                {
                  _id: element.id ,
                  _name: element.nome,
                }
        this.targe.push( registro );
      });
    };
    // sort dos vetores 
    let by = '_name'
    this.source.sort((a: any, b: any) => {
                  if (a[by] < b[by]) {
                    return this.sorted ? 1 : -1;
                  }
                  if (a[by] > b[by]) {
                    return this.sorted ? -1 : 1;
                  }
                  return 0;
                });
    this.targe.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }
      return 0;
    });


    if ( this.usuariosDepartamento.length < 1 ) this.targe = [];
    if ( this.usuarios[0].nome == null ) this.source = []; 
    

  }
      
  async salvarUsuariosDoDepartamento(){
    this.disabledVoltar = false
      try {
        let resposta = await this.connectHTTP.callService({
          service: 'salvarUsuariosDoDepartamento',
          paramsService: {
            departamentoIdSelecionado: this.departamentoIdSelecionado ,
            usuariosDoDepartamento: JSON.stringify(this.targe)
          }
        }) 
        if (resposta.error){
          this.toastrService.error(resposta.error);
        }else {
          this.toastrService.success('Salvo com sucesso');
        }
      }
      catch (e) {
        this.toastrService.error('Erro ao salvar');
      }
      
    }
      
    
      






  }




  
 

