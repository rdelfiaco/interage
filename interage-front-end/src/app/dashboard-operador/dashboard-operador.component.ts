import { Component, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-dashboard-operador',
  templateUrl: './dashboard-operador.component.html',
  styleUrls: ['./dashboard-operador.component.scss']
})
export class DashboardOperadorComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    this.router.navigate(['/eventos']);
  }
  logout() {
    this.auth.logout();
  }
  openPage(page: string) {
    this.router.navigate([page]);
  }
}
