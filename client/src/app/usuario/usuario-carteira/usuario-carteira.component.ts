import { Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-usuario-carteira',
  templateUrl: './usuario-carteira.component.html',
  styleUrls: ['./usuario-carteira.component.scss'],
})
export class UsuarioCarteiraComponent implements OnInit {


  pessoasNaoPertencenteCarteira: any;
  carteiraUsuario: any; 
  usuarioSelecionado: object;
  sourceCart: Array<any>;
  targeCart:  Array<any>;
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

                ) { 
                  
                 }

  ngOnInit() {

    //obtem o usuario selecionado 
  this.usuarioService.emitiUsuarioSelecionado.subscribe(
    usu => {this.usuarioSelecionado = usu;
            if (this.usuarioSelecionado){
              this.disabledVoltar = true;
              this.lercarteiraUsuario();
            }
    }
  );
  
}

  async lercarteiraUsuario(){
    try {
      let resp = await this.connectHTTP.callService({
        service: 'getcarteiraUsuarioSeleconado',
        paramsService: this.usuarioSelecionado
      }) as any;

      if (resp.error){
        this.toastrService.error(resp.error);
      }else {
        console.log(resp.resposta)
        this.carteiraUsuario = resp.resposta.carteiraUsuario; 
        this.pessoasNaoPertencenteCarteira = resp.resposta.pessoasNaoPertencenteCarteira;
        this.povoaVetores()
        console.log('cart', this.targeCart)
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as carteira do usuário', e);
    }
  }

  povoaVetores(){
    this.targeCart = [];
    this.sourceCart = [];
    this.pessoasNaoPertencenteCarteira.forEach( element => {
      let registro = 
              {
                _id: element.id ,
                _name: element.nome,
              }
     this.sourceCart.push( registro );
    });
    this.carteiraUsuario.forEach(element => {
      let registro = 
              {
                _id: element.id ,
                _name: element.nome,
              }
     this.targeCart.push( registro );
    });

    let by = '_name'
    this.sourceCart.sort((a: any, b: any) => {
                  if (a[by] < b[by]) {
                    return this.sorted ? 1 : -1;
                  }
                  if (a[by] > b[by]) {
                    return this.sorted ? -1 : 1;
                  }
                  return 0;
                });
    this.targeCart.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }
      return 0;
    });

    if ( this.carteiraUsuario[0].nome == null ) this.targeCart = [];
    if ( this.pessoasNaoPertencenteCarteira[0].nome == null ) this.sourceCart = []; 
    
    
  }

  async salvar(){
      this.disabledVoltar = false

        try {
          let resposta = await this.connectHTTP.callService({
            service: 'salvarcarteiraDoUsuario',
            paramsService: {
              usuarioSelecionado: JSON.stringify(this.usuarioSelecionado) ,
              carteiraDoUsuario: JSON.stringify(this.targeCart)
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
//    history.back();
    this.usuarioService.setAba(1); 

  }


}
