
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { TabsetComponent } from 'ng-uikit-pro-standard';
import { ComunicaPropostaService } from './comunica-proposta.service';
import { Observable } from 'rxjs';
// import { FormataDinheiroPipe } from '../shared/pipes/mascaraDinheiro/formata-dinheiro.pipe';

@Component({
  selector: 'app-proposta',
  templateUrl: './proposta.component.html',
  styleUrls: ['./proposta.component.scss'],
  // providers: [FormataDinheiroPipe]
})
export class PropostaComponent implements OnInit {
  _abaSelecionada: Observable<number>;
  @ViewChild('propostaTabs') staticTabs: TabsetComponent;
  @Input() pessoa: string;
  @Input() set abaSelecionada(abaSelecionada: Observable<number>) {
    this._abaSelecionada = abaSelecionada;
    abaSelecionada.subscribe(aba => {
      this.aba.setAba(aba);
    })
  };
  get abaSelecionada() {
    return this._abaSelecionada;
  }


  @Output() returnPessoaSelecionada: EventEmitter<any> = new EventEmitter();
  @Output() returnProposta = new EventEmitter();
  @Input() returnProp: boolean;

  propostaElaborada: boolean;

  constructor(
    private aba: ComunicaPropostaService,

  ) {
    this.aba.setAba(5)
  }

  ngOnInit() {
    this.propostaElaborada = true;
    this.staticTabs.setActiveTab(this.aba.getAba())

    this.aba.emitiAba.subscribe(
      abaA => this.staticTabs.setActiveTab(abaA)
    )
  }

  returnPropostaPai(proposta: any) {
    this.returnProposta.emit(proposta);
  }

  returnPessoaSelecionada_(){
    this.returnPessoaSelecionada.emit();
  }


}

