import { CheckPermissaoRecurso } from './../shared/services/checkPemissaoRecurso';
import { Component, OnInit, ElementRef, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { ToastService, ModalDirective } from '../../lib/ng-uikit-pro-standard';
import { Observable } from 'rxjs';
import { Usuario } from '../login/usuario';
import { Router } from '@angular/router';
import { isNumber } from 'util';


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
  nomePessoa: string;

  constructor(
    private router: Router,
    private connectHTTP: ConnectHTTP,
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
    let textoPesquisaPessoa_ = this.textoPesquisaPessoa.replace(/\W/gi, '');
    if (isNumber(textoPesquisaPessoa_)) {this.textoPesquisaPessoa = textoPesquisaPessoa_} 
     
    try {
      let pessoasEncontradas = await this.connectHTTP.callService({
        service: 'pesquisaPessoas',
        paramsService: {
          searchText: this.textoPesquisaPessoa
        }
      }) as any;
      this.pessoasEncontradas = pessoasEncontradas.resposta;
      console.log('this.pessoasEncontradas ', this.pessoasEncontradas )
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
    return this.router.navigate(['pessoas/'+pessoa.id]);
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

  openPage(page: string, event: any) {
    event.preventDefault();
    event.stopPropagation();
    setTimeout(_ => {
      this.router.navigate([page]);
    }, 100);
  }
 
  
}
