import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../login/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pages-layout',
  templateUrl: './pages-layout.component.html',
  styleUrls: ['./pages-layout.component.scss']
})
export class PagesLayoutComponent implements OnInit {

  hasLogado: Observable<boolean>;
  constructor(private router: Router,
    private auth: AuthService) {
    this.hasLogado = this.auth.estaLogado();
  }
  ngOnInit() {
    this.hasLogado.subscribe(user => {
      if (user) {
        return this.router.navigate(['']);
      }
      return this.router.navigate(['/login']);
    });
  }

}
