import { Component, OnInit } from '@angular/core';
import { Usuario } from '../login/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {

  private usuario: Usuario = new Usuario();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  openPage(page: string) {
    this.router.navigate([page]);
  }
}
