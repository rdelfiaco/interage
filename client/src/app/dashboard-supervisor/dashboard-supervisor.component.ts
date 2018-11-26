import { Component, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-dashboard-supervisor',
  templateUrl: './dashboard-supervisor.component.html',
  styleUrls: ['./dashboard-supervisor.component.scss']
})
export class DashboardSupervisorComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
  }
  logout() {
    this.auth.logout();
  }
  openPage(page: string) {
    this.router.navigate([page]);
  }
}
