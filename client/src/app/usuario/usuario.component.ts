import { UsuarioService } from './usuario.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TabsetComponent } from '../../lib/ng-uikit-pro-standard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  @ViewChild('abasTabs') staticTabs: TabsetComponent;
  abaAtual: number;

  constructor( private usuarioService : UsuarioService) {
          this.usuarioService.setAba(1);

   }

  ngOnInit() {
    
    this.staticTabs.setActiveTab(1)

    this.usuarioService.emitiAba.subscribe(
      abaA => { debugger;
                this.staticTabs.setActiveTab(abaA);
                this.abaAtual = abaA}
    )
  }

}
