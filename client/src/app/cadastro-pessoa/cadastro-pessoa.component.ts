import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { Usuario } from '../login/usuario';
import { Observable, Observer, Subscriber } from 'rxjs';
import { AuthService } from '../login/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../lib/ng-uikit-pro-standard';
import { CheckPermissaoRecurso } from '../shared/services/checkPemissaoRecurso';

@Component({
  selector: 'app-cadastro-pessoa',
  templateUrl: './cadastro-pessoa.component.html',
  styleUrls: ['./cadastro-pessoa.component.scss']
})
export class CadastroPessoaComponent implements OnInit {

  private _pessoa;
  pessoaObject: any;
  id_pessoa: string;
  usuarioLogado: any;
  @Output() refresh = new EventEmitter();
  @Input() pessoa: Observable<string[]>;


  constructor(private connectHTTP: ConnectHTTP, 
    private localStorage: LocalStorage,
    private auth: AuthService, 
    private route: ActivatedRoute,
    private toastrService: ToastService,
    public checkPermissaoRecurso: CheckPermissaoRecurso ) {
    
      this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;

    this.route.params.subscribe(res => {
      this.id_pessoa = res.id
    });
  }

  async ngOnInit() {
    this.carregaPessoa();
  }

  async carregaPessoa() {
    if (this.id_pessoa)
      this.getPessoa(this.id_pessoa);
  }

  refreshDad() {
    if (!this.pessoaObject)
      this.refresh.emit();
    else this.refreshPessoaAdd({ idPessoa: this.pessoaObject.principal.id });
  }

  async refreshPessoaAdd(p: any) {
    this.getPessoa(p.idPessoa);
  }

  async getPessoa(pessoaId: any) {
    let pessoa = await this.connectHTTP.callService({
      service: 'getPessoa',
      paramsService: {
        id_pessoa: pessoaId
      }
    }) as any;

    //  - se o cliente não estiver vinculado a nenhuma carteira o usuário logado pode ter acesso; 
    //  - se o cliente esteja vinculado a uma carteria e se o usuário logado possui carteira o
    //           o acesso aos dados do cliente somente se ele pertence a carteira do usuário logado  
    if ((this.usuarioLogado.possui_carteira_cli && pessoa.resposta.principal.id_usuario_carteira ) ||
      (this.usuarioLogado.id_pessoa == pessoa.resposta.principal.id)) {
      if ((this.usuarioLogado.id == pessoa.resposta.principal.id_usuario_carteira) || 
        (this.usuarioLogado.id_pessoa == pessoa.resposta.principal.id)) {
        this.pessoaObject = pessoa.resposta;
        this.pessoa = new Observable(o => o.next(pessoa.resposta));
      } else {
        this.toastrService.error('O cliente não faz parte de sua carteira');
        window.history.back();
      }
    }
    else {
      // verifica se o usuário logado possui acesso aos clientes sem carteira 
      if ( this.checkPermissaoRecurso.usuarioLocadoAcessaRecurso(4) || 
           this.usuarioLogado.id_pessoa == pessoa.resposta.principal.id) {

          this.pessoaObject = pessoa.resposta;
          this.pessoa = new Observable(o => o.next(pessoa.resposta));

      }else {
        this.toastrService.error('Você não tem acesso aos clientes sem carteira');
        window.history.back();
      }
    }
  }
}
