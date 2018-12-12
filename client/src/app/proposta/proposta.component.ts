
import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ng-uikit-pro-standard';
import { ComunicaPropostaService } from './comunica-proposta.service';
import { FormataDinheiroPipe } from '../shared/pipes/mascaraDinheiro/formata-dinheiro.pipe';

@Component({
  selector: 'app-proposta',
  templateUrl: './proposta.component.html',
  styleUrls: ['./proposta.component.scss'],
  providers: [FormataDinheiroPipe]
})
export class PropostaComponent implements OnInit {

  @ViewChild('propostaTabs') staticTabs: TabsetComponent;


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



}

