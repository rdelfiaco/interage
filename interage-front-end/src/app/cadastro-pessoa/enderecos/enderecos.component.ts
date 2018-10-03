import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-enderecos',
  templateUrl: './enderecos.component.html',
  styleUrls: ['./enderecos.component.scss']
})
export class EnderecosComponent implements OnInit {

  @Output() refresh = new EventEmitter();
  @Input() pessoa: Observable<string[]>;
  _pessoaObject: any;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["pessoa"] && this.pessoa) {
      this.pessoa.subscribe(pessoa => {
        debugger;
        this._pessoaObject = pessoa
      });
    }
  }


}
