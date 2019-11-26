import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { UsuarioService } from '../../usuario/usuario.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-relacionamento-volta',
  templateUrl: './relacionamento-volta.component.html',
  styleUrls: ['./relacionamento-volta.component.scss']
})
export class RelacionamentoVoltaComponent implements OnInit {

  idTipoDeRelacSelecionado: any;
  descriTipoDeRelacSelecionado: any;

  relacionamentos: any;
  relacionamentosVolta: any; 
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

  constructor(
    private usuarioService : UsuarioService,
    private connectHTTP: ConnectHTTP,
    private toastrService: ToastService,
    private _location: Location,
    private route: ActivatedRoute,
  ) {

    this.route.params.subscribe(res => {
      let _res = res.id;
      _res =  JSON.parse(_res);
      this.idTipoDeRelacSelecionado = _res.idTipoDeRelac
      this.descriTipoDeRelacSelecionado = _res.descriTipoDeRelac
    });

   }


   ngOnInit() {

    this.lerCanaisMotivo();

  }

  async lerCanaisMotivo(){
    try {
      let resp = await this.connectHTTP.callService({
        service: 'getRelacionamentosVolta',
        paramsService: {
          idTipoDeRelacSelecionado: this.idTipoDeRelacSelecionado
        }
      }) as any;

      if (resp.error){
        this.toastrService.error(resp.error);
      }else {
        this.relacionamentos = resp.resposta.relacionamentos; 
        this.relacionamentosVolta = resp.resposta.relacionamentosVolta; 

        console.log('this.relacionamentos ', this.relacionamentos)
        console.log('this.relacionamentosVolta ', this.relacionamentosVolta)

        this.povoaVetores()
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler os relacionamentos ', e);
    }
  }

  povoaVetores(){
    this.targe = [];
    this.source = [];
    this.relacionamentos.forEach( element => {
      
      let registro = 
              {
                
                _id: element.id ,
                _name: element.descricao,
              }
     this.source.push( registro );
    });
    this.relacionamentosVolta.forEach(element => {
      
      let registro = 
              {
                _id: element.id ,
                _name: element.descricao,
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

    if ( this.relacionamentosVolta[0].descricao == null ) this.targe = [];
    if ( this.relacionamentos[0].descricao == null ) this.source = []; 
    


  }

  async salvar(){
      this.disabledVoltar = false
        try {
          let resposta = await this.connectHTTP.callService({
            service: 'salvarRelacionamentoVolta',
            paramsService: {
              idTipoDeRelacSelecionado: JSON.stringify(this.idTipoDeRelacSelecionado) ,
              relacionamentosVoltaNovos: JSON.stringify(this.targe)
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

  goBack(){
    this._location.back();
  }

}
