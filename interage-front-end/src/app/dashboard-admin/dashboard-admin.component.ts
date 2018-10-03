import { Component, OnInit } from '@angular/core';
import { Usuario } from '../login/usuario';
import { Router } from '@angular/router';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {

  private usuario: Usuario = new Usuario();

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
  }

  openPage(page: string) {
    this.router.navigate([page]);
  }
  logout() {
    this.auth.logout();
  }
}
