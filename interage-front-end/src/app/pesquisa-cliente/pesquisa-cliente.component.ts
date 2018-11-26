import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { LocalStorage } from '../shared/services/localStorage';
import { ConnectHTTP } from '../shared/services/connectHTTP';

@Component({
  selector: 'app-pesquisa-cliente',
  templateUrl: './pesquisa-cliente.component.html',
  styleUrls: ['./pesquisa-cliente.component.scss']
})
export class PesquisaClienteComponent implements OnInit {

  searchText: string = '';
  clientes: Array<any> = [];
  setTimeOut: any;
  clienteSelecionado: string;
  clienteSelecionadoObject: Array<object>;

  @Input()
  set initValueId(initValueId: any) {
    this.initValue(initValueId);
  }


  get initValueId(): any {
    return this.clienteSelecionado;
  }

  @Output() onSelectCliente = new EventEmitter();

  constructor(private connectHTTP: ConnectHTTP, private localStorage: LocalStorage) {
    this.pesquisarCliente();
  }

  async initValue(initValueId: string) {
    let pessoa = await this.connectHTTP.callService({
      service: 'getPessoa',
      paramsService: {
        id_pessoa: initValueId
      }
    }) as any;

    this.clienteSelecionado = initValueId;
    debugger;
    pessoa = pessoa.resposta.principal
    this.clienteSelecionadoObject = [{ label: pessoa.nome, value: pessoa.id }];
    this.clientes.concat(this.clienteSelecionadoObject)
  }

  async pesquisarCliente() {
    let clientesEncontrados = await this.connectHTTP.callService({
      service: 'pesquisaPessoas',
      paramsService: {
        searchText: this.searchText
      }
    }) as any;
    this.clientes = clientesEncontrados.resposta;
    this.clientes = this.clientes.map(cliente => {
      return { value: cliente.id, label: cliente.nome }
    })
    this.clientes.concat(this.clienteSelecionadoObject);
  }

  pesquisar(event) {
    var self = this;
    if (this.setTimeOut) clearTimeout(this.setTimeOut);
    this.setTimeOut = setTimeout(async function () {
      self.searchText = event.target.value;
      self.pesquisarCliente();
    }, 800);
  }

  selecionarCliente(valor) {
    this.onSelectCliente.emit(valor);
  }

  ngOnInit() {

  }

}
