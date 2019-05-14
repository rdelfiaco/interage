import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { Usuario } from '../login/usuario';
import { Observable, Observer, Subscriber } from 'rxjs';
import { AuthService } from '../login/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cadastro-pessoa',
  templateUrl: './cadastro-pessoa.component.html',
  styleUrls: ['./cadastro-pessoa.component.scss']
})
export class CadastroPessoaComponent implements OnInit {

  private _pessoa;
  pessoaObject: any;
  id_pessoa: string;
  @Output() refresh = new EventEmitter();
  @Input() pessoa: Observable<string[]>;

  constructor(private connectHTTP: ConnectHTTP, private localStorage: LocalStorage,
    private auth: AuthService, private route: ActivatedRoute) {
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
    debugger
    this.pessoaObject = pessoa.resposta;
    this.pessoa = new Observable(o => o.next(pessoa.resposta));
  }


  
}
