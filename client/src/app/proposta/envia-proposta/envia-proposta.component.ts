import { Component, OnInit } from '@angular/core';
import { } from 'pdfkit';


@Component({
  selector: 'app-envia-proposta',
  templateUrl: './envia-proposta.component.html',
  styleUrls: ['./envia-proposta.component.scss']
})
export class EnviaPropostaComponent implements OnInit {

  constructor() { }



  ngOnInit() {
    var docDefinition = { content: 'This is an sample PDF printed with pdfMake' };

    //pdfMake.createPdf(docDefinition).open();
  }

}
