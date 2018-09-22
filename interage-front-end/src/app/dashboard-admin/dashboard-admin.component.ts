import { Component, OnInit } from '@angular/core';
import { Usuario } from '../login/usuario';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {

  private usuario: Usuario = new Usuario();

  constructor( ) { }

  ngOnInit() {
  }



}
