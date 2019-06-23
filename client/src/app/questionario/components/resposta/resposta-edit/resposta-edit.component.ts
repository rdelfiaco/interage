import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-resposta-edit',
  templateUrl: './resposta-edit.component.html',
  styleUrls: ['./resposta-edit.component.scss']
})
export class RespostaEditComponent implements OnInit {

  constructor(private _location: Location,) { }

  ngOnInit() {
  }

  goBack() {
    this._location.back();
  }
}
