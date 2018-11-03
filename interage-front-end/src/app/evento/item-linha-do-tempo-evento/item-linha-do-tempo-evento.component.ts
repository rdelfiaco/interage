import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-item-linha-do-tempo-evento',
  templateUrl: './item-linha-do-tempo-evento.component.html',
  styleUrls: ['./item-linha-do-tempo-evento.component.scss']
})
export class ItemLinhaDoTempoEventoComponent implements OnInit {

  @Input() eventos: any;
  @Output() setEventoSelecionado = new EventEmitter();
  eventoSelecionado: object;
  constructor() { }

  ngOnInit() {
  }

  selecionaEvento(event, evento) {
    event.preventDefault();
    event.stopPropagation();
    this.eventoSelecionado = Object.assign({}, evento);
    debugger;
    this.setEventoSelecionado.emit(this.eventoSelecionado);
  }

  setEventoSelecionadoPai(evento: any) {
    debugger;
    this.setEventoSelecionado.emit(evento);
  }
}
