import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-encaminhar-evento',
  templateUrl: './encaminhar-evento.component.html',
  styleUrls: ['./encaminhar-evento.component.scss']
})
export class EncaminharEventoComponent implements OnInit {

  @Input() pessoa: any
  @Input() evento: any

  constructor() { }

  ngOnInit() {
  }

}
