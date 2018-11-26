import {Component, ElementRef, ViewChild, Input } from '@angular/core';
import { state, style, trigger, transition, animate } from '@angular/animations';

@Component({
  exportAs: 'sbItemBody',
  selector: 'mdb-item-body, mdb-accordion-item-body',
  templateUrl: 'sb-item.body.html',
  animations: [
    trigger('expandBody', [
      state('collapsed', style({height: '0px', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('500ms ease')),
    ])
  ]
})
export class SBItemBodyComponent {
  @Input() customClass: string;

  public height = '0';
  expandAnimationState = 'collapsed';

  @ViewChild('body') bodyEl: ElementRef;

  constructor() {}

  toggle(collapsed: boolean) {
    setTimeout(() => {
      collapsed ? this.expandAnimationState = 'collapsed' : this.expandAnimationState = 'expanded';
    }, 0);
  }
}
