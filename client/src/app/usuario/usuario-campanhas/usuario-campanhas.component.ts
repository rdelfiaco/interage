import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-usuario-campanhas',
  templateUrl: './usuario-campanhas.component.html',
  styleUrls: ['./usuario-campanhas.component.scss']
})
export class UsuarioCampanhasComponent implements OnInit {


@Input() usuarioID: number;

  constructor() { }

  ngOnInit() {
  }

}
