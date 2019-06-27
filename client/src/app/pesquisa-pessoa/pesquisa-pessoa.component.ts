import { CheckPermissaoRecurso } from './../shared/services/checkPemissaoRecurso';
import { Component, OnInit, ElementRef, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { ToastService, ModalDirective } from '../../lib/ng-uikit-pro-standard';
import { Observable } from 'rxjs';
import { Usuario } from '../login/usuario';


@Component({
  selector: 'app-pesquisa-pessoa',
  templateUrl: './pesquisa-pessoa.component.html',
  styleUrls: ['./pesquisa-pessoa.component.scss']
})
export class PesquisaPessoaComponent implements OnInit {
  private usuarioLogado: Usuario;
  textoPesquisaPessoa: string;
  pessoasEncontradas: any = [];
  firstPageNumber: number = 1;
  lastPageNumber: number;
  sorted = false;
  maxVisibleItems: number = 10;
  @ViewChildren('list') list: QueryList<ElementRef>;
  @ViewChild('pessoaEditando') pessoaEditando: ModalDirective;
  paginators: Array<any> = [];
  activePage: number = 1;
  firstVisibleIndex: number = 1;
  lastVisibleIndex: number = 10;
  pessoa: Observable<object>;
  editandoPessoaObject: any;
  constructor(private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private toastrService: ToastService,
    private checkPermissaoRecurso: CheckPermissaoRecurso ) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
  }

  ngOnInit() {

  }

  sortBy(by: string | any): void {
    // if (by == 'dt_criou') {
    //   this.search().reverse();
    // } else {
    this.pessoasEncontradas.sort((a: any, b: any) => {
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

  digitaTextoPesquisa(event) {
    return event.keyCode == 13 && this.pesquisar();
  }

  async pesquisar() {
    try {
      let pessoasEncontradas = await this.connectHTTP.callService({
        service: 'pesquisaPessoas',
        paramsService: {
          searchText: this.textoPesquisaPessoa
        }
      }) as any;
      this.pessoasEncontradas = pessoasEncontradas.resposta;
      if (!this.pessoasEncontradas.length) {
        this.pessoasEncontradas = [];
        this.toastrService.error(pessoasEncontradas.error);
      }
      setTimeout(() => {
        this.paginators = []
        for (let i = 1; i <= this.pessoasEncontradas.length; i++) {
          if (i % this.maxVisibleItems === 0) {
            this.paginators.push(i / this.maxVisibleItems);
          }
        }
        if (this.pessoasEncontradas.length % this.paginators.length !== 0) {
          this.paginators.push(this.paginators.length + 1);
        }
        this.lastPageNumber = this.paginators.length;
        this.lastVisibleIndex = this.maxVisibleItems;
      }, 200);
    }
    catch (e) {
      console.log('error ', e )
      this.toastrService.error(e.error);
      this.pessoasEncontradas = [];
    }
  }

  closeModal() {
    this.pessoaEditando.hide();
  }


  async editarPessoa(pessoa: any) {

    this.editandoPessoaObject = pessoa;
    let pessoaId = pessoa.id
    let p = await this.connectHTTP.callService({
      service: 'getPessoa',
      paramsService: {
        id_pessoa: pessoaId
      }
    }) as any;
    
    //  - se o cliente não estiver vinculado a nenhuma carteira o usuário logado pode ter acesso; 
    //  - se o cliente esteja vinculado a uma carteria e se o usuário logado possui carteira o
    //           o acesso aos dados do cliente somente se ele pertence a carteira do usuário logado  
    if (this.usuarioLogado.possui_carteira_cli  && p.resposta.principal.id_usuario_carteira ){
      if(this.usuarioLogado.id == p.resposta.principal.id_usuario_carteira){

        this.pessoa = new Observable(o => o.next(p.resposta));
        this.pessoaEditando.show();
      } else {
        this.toastrService.error('O cliente não faz parte de sua carteira');
      }
      }
      else {
        // verifica se o usuário logado possui acesso aos clientes sem carteira 
        if ( this.checkPermissaoRecurso.usuarioLocadoAcessaRecurso(4) ){
          this.pessoa = new Observable(o => o.next(p.resposta));
          this.pessoaEditando.show()
        }else {
          this.toastrService.error('Você não tem acesso aos clientes sem carteira');
        }
    }

  }

  async refresh() {
    let pessoaId = this.editandoPessoaObject.id
    let pessoa = await this.connectHTTP.callService({
      service: 'getPessoa',
      paramsService: {
        id_pessoa: pessoaId
      }
    }) as any;
    this.pessoa = new Observable(o => o.next(pessoa.resposta));

  }


 
  
}
