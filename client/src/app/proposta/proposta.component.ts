import { TabelaFipe } from './tabela-fipe';
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { TabsetComponent } from 'ng-uikit-pro-standard';
import { Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'app-proposta',
  templateUrl: './proposta.component.html',
  styleUrls: ['./proposta.component.scss']
})
export class PropostaComponent implements OnInit {

  @ViewChild('propostaTabs') staticTabs: TabsetComponent;
  
  //tabelaFifeConsiderada: boolean;
  //observerTabelaFipe: Subscriber<object>;
  //tabelaFipeObject: any;

  // @Input() refresh = TabelaFipe;
  // @Output() refreshtabelaFipe=  new EventEmitter();

  propostaElaborada: boolean;

  constructor() { }

  ngOnInit() {
    //this.tabelaFifeConsiderada = true;
    //this.propostaElaborada = true;
    this.staticTabs.setActiveTab(6);
  }
  
  refreshDad(tabelaFipe: TabelaFipe) {


    console.log('refreshDad');

    // this.refreshtabelaFipe.emit( tabelaFipe );

    //console.log(tabelaFipe.precoMedio)

  }

}

