import { Component, OnInit, SimpleChanges, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']
})
export class AuditoriaComponent implements OnInit {

  @Output() refresh = new EventEmitter();
  @Input() pessoa: Observable<string[]>;
  _pessoaObject: any;
  tableData: any;
  sorted: any;
  
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["pessoa"] && this.pessoa) {
      this.pessoa.subscribe(pessoa => {
        this._pessoaObject = pessoa;
        this.tableData = this._pessoaObject.auditoria_; 
      });
    }
  }

  sortBy(by: string | any): void {
    // if (by == 'dt_criou') {
    //   this.search().reverse();
    // } else {
    this.tableData.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }
      return 0;
    });
    //}
    this.sorted = !this.sorted;
  }

}
