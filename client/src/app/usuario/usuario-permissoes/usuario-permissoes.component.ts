import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-usuario-permissoes',
  templateUrl: './usuario-permissoes.component.html',
  styleUrls: ['./usuario-permissoes.component.scss']
})
export class UsuarioPermissoesComponent implements OnInit {

  @Input() usuarioID: number;

  
  constructor() { }

  ngOnInit() {
  }

}
