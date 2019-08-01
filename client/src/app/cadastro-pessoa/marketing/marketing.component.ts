import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.scss']
})
export class MarketingComponent implements OnInit {

  @Output() refresh = new EventEmitter();
  @Input() pessoa: Observable<string[]>;
  _pessoaObject: any;
  
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["pessoa"] && this.pessoa) {
      this.pessoa.subscribe(pessoa => {
        this._pessoaObject = pessoa
      });
    }

  }
  
}