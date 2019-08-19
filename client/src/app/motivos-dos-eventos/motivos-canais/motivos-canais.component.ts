import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { UsuarioService } from '../../usuario/usuario.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-motivos-canais',
  templateUrl: './motivos-canais.component.html',
  styleUrls: ['./motivos-canais.component.scss']
})
export class MotivosCanaisComponent implements OnInit {
  canais: any;
  canaisMotivo: any; 
  motivoSelecionado: any;
  source: Array<any>;
  targe:  Array<any>;
  disabledVoltar: boolean = true;
  sorted: boolean = false;
  nomeMotivo: any;

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
                  private _location: Location,
                  private route: ActivatedRoute,

                ) { 

                  this.route.params.subscribe(res => {
                    let _res = res.id;
                    _res =  JSON.parse(_res);
                    this.motivoSelecionado = _res.idMotivo
                    this.nomeMotivo = _res.nomeMotivo
                  });

                 }

  ngOnInit() {

    this.lerCanaisMotivo();

  }

  async lerCanaisMotivo(){
    try {
      let resp = await this.connectHTTP.callService({
        service: 'getCanaisMotivoSeleconado',
        paramsService: {
          motivoSelecionado: this.motivoSelecionado
        }
      }) as any;

      if (resp.error){
        this.toastrService.error(resp.error);
      }else {
        this.canais = resp.resposta.canais; 
        this.canaisMotivo = resp.resposta.canaisMotivo; 
        this.povoaVetores()
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as canais do usuário', e);
    }
  }

  povoaVetores(){
    this.targe = [];
    this.source = [];
    this.canais.forEach( element => {
      let registro = 
              {
                _id: element.id ,
                _name: element.nome,
              }
     this.source.push( registro );
    });
    this.canaisMotivo.forEach(element => {
      let registro = 
              {
                _id: element.id ,
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



    if ( this.canaisMotivo[0].nome == null ) this.targe = [];
    if ( this.canais[0].nome == null ) this.source = []; 
    
  }

  async salvar(){
      this.disabledVoltar = false
        try {
          let resposta = await this.connectHTTP.callService({
            service: 'salvarCanaisDoMotivo',
            paramsService: {
              motivoSelecionado: JSON.stringify(this.motivoSelecionado) ,
              canaisDoMotivo: JSON.stringify(this.targe)
            }
          }) 
          debugger
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