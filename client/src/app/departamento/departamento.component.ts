import { Component, OnInit } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { Router } from '@angular/router';
import { ToastService } from '../../lib/ng-uikit-pro-standard';
import { Usuario } from '../login/usuario';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.scss']
})
export class DepartamentoComponent implements OnInit {

  usuarioLogado: any;
  departamentos: Array<any>;
  usuarios: Array<any>;
  departamentosVaule: Array<any>
  departamentoSelecionado: boolean = false;
  sorted: boolean = false;
  usuariosDepartamento: Array<any>;
  departamentoNome: any;


  constructor(
    private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private toastrService: ToastService ) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;

  }

  async ngOnInit() {
    let getDepartamentos = await this.connectHTTP.callService({
      service: 'getDepartamentosUsuarios',
      paramsService: {
      }
    }) as any;

    this.departamentos = getDepartamentos.resposta.departamentos;
    this.usuarios = getDepartamentos.resposta.usuarios;

    this.departamentosVaule =   this.departamentos.map((d: any) => {
        if (d.status) return { value: d.id, label: d.nome }
      })
      this.departamentoSelecionado = false;
  }


  sortBy(by: string | any): void {
    // if (by == 'dt_criou') {
    //   this.search().reverse();
    // } else {
      this.departamentos.sort((a: any, b: any) => {
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

  abirUsuariosdoDepartamento(idDepartamento, departamentoNome){

    this.usuariosDepartamento = this.usuarios.filter( e => e.id_organograma == idDepartamento );

    this.departamentoNome = departamentoNome;
    
  }
  sortByU(by: string | any): void {
    // if (by == 'dt_criou') {
    //   this.search().reverse();
    // } else {
      this.usuariosDepartamento.sort((a: any, b: any) => {
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

}
