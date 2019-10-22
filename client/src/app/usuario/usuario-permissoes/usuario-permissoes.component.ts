import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';


@Component({
  selector: 'app-usuario-permissoes',
  templateUrl: './usuario-permissoes.component.html',
  styleUrls: ['./usuario-permissoes.component.scss']
})
export class UsuarioPermissoesComponent implements OnInit {

  permissoes: any;
  permissoesUsuario: any; 
  usuarioSelecionado: object;
  source: Array<any>;
  targe:  Array<any>;
  disabledVoltar: boolean = true;
  sorted: boolean = false;


  novoFormato =  { add: 'Adicionar', 
                  remove: 'Remover', 
                  all: 'Selecionar todos', 
                  none: 'Desfazer a seleção', 
                  direction: 'left-to-right', 
                  draggable: true, 
                  locale: undefined }

    constructor(  private usuarioService : UsuarioService,
                  private connectHTTP: ConnectHTTP,
                  private toastrService: ToastService,
                ) {  }

  ngOnInit() {

    //obtem o usuario selecionado 
    this.usuarioService.emitiUsuarioSelecionado.subscribe(
      usu => {this.usuarioSelecionado = usu;
              if (this.usuarioSelecionado){
                this.disabledVoltar = true;
                this.lerPermissoesUsuario();
              }
      }
    );
  }

  async lerPermissoesUsuario(){
    try {
      let resp = await this.connectHTTP.callService({
        service: 'getPermissoesUsuarioSeleconado',
        paramsService: this.usuarioSelecionado
      }) as any;

      if (resp.error){
        this.toastrService.error(resp.error);
      }else {
        this.permissoes = resp.resposta.permissoes; 
        this.permissoesUsuario = resp.resposta.permissoesUsuario; 
        this.povoaVetores()

        console.log('per', this.targe)

      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes do usuário', e);
    }
  }

  povoaVetores(){
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
    this.permissoesUsuario.forEach(element => {
      let registro = 
              {
                _id: element.id_recursos ,
                _name: element.nome,
              }
     this.targe.push( registro );
    });

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

    if ( this.permissoesUsuario[0].nome == null ) this.targe = [];
    if ( this.permissoes[0].nome == null ) this.source = []; 

  }

  async salvar(){
      this.disabledVoltar = false

        try {
          let resposta = await this.connectHTTP.callService({
            service: 'salvarPermissoesDoUsuario',
            paramsService: {
              usuarioSelecionado: JSON.stringify(this.usuarioSelecionado) ,
              permissoesDoUsuario: JSON.stringify(this.targe)
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

  voltar(){
    this.usuarioService.setAba(1); 
  }

}
