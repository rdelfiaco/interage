import { Component, OnInit, Input } from '@angular/core';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { CrudCampanhaService } from '../crud-campanha.service';
import { BancoDados } from '../../shared/services/bancoDados';


@Component({
  selector: 'app-usuarios-campanha',
  templateUrl: './usuarios-campanha.component.html',
  styleUrls: ['./usuarios-campanha.component.scss']
})
export class UsuariosCampanhaComponent implements OnInit {

  
  usuarios: any;
  campanhaUsuarios: any; 
  campanhaSelecionada: object;
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

    constructor(  private crudCampanhaService : CrudCampanhaService,
                  private connectHTTP: ConnectHTTP,
                  private toastrService: ToastService,
                  private bancoDados: BancoDados = new BancoDados,
                  private service : CrudCampanhaService = new CrudCampanhaService, 
                ) {  }

  ngOnInit() {

    //obtem a campanha selecionada
    this.crudCampanhaService.emitiCampanhaSelecionada.subscribe( camp => {
      this.campanhaSelecionada = camp; 
      if (this.campanhaSelecionada){
        this.disabledVoltar = true;
        this.lerUsuariosCampanha()
      }
    })
  }



  async lerUsuariosCampanha(){
    this.campanhaUsuarios = await this.bancoDados.lerDados('getUsuariosCampanhaSelecionada', {campanhaSelecionada: JSON.stringify(this.campanhaSelecionada )}) as any;
    this.campanhaUsuarios = this.campanhaUsuarios.resposta;
    this.usuarios = await this.bancoDados.lerDados('getUsuarios', {}) as any;
    this.usuarios =this.usuarios.resposta.filter( e => e.status );
    this.povoaVetores();
  }

  povoaVetores(){

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
    this.campanhaUsuarios.forEach(element => {
      let registro = 
              {
                _id: element.id_usuario ,
                _name: element.nome,
              }
     this.targe.push( registro );
    });

    this.source.sort();
    this.targe.sort();


    if ( this.campanhaUsuarios[0].nome == null ) this.targe = [];
    if ( this.usuarios[0].nome == null ) this.source = []; 
    
    console.log('source ', this.source);
    console.log('targe ', this.targe)

  }

  async salvarUsuariosDaCampanha(){
      this.disabledVoltar = false

        // try {
        //   let resposta = await this.connectHTTP.callService({
        //     service: 'salvarUsuariosDaCampanha',
        //     paramsService: {
        //       campanhaSelecionado: JSON.stringify(this.campanhaselecionada ) ,
        //       usuariosDaCampanha: JSON.stringify(this.targe)
        //     }
        //   }) 
        //   if (resposta.error){
        //     this.toastrService.error(resposta.error);
        //   }else {
        //     this.toastrService.success('Salvo com sucesso');
        //   }
        // }
        // catch (e) {
        //   this.toastrService.error('Erro ao salvar');
        // }

        let resposta  = await this.bancoDados.lerDados('salvarUsuariosDaCampanha',
                        {campanhaSelecionada: JSON.stringify(this.campanhaSelecionada ) ,
                          usuariosDaCampanha: JSON.stringify(this.targe)}) as any;

        console.log(resposta)
  }



  voltar(){
    this.service.abaAtual = 1 
  }

}
