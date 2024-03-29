import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation, ElementRef, HostListener, Renderer2, ChangeDetectorRef
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Option } from './option';
import { OptionList } from './option-list';

@Component({
  selector: 'mdb-select-dropdown',
  templateUrl: 'select-dropdown.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [trigger('dropdownAnimation', [
    state('invisible', style({ height: '{{startHeight}}', }), { params: { startHeight: 0 } }),
    state('visible', style({ height: '{{endHeight}}', }), { params: { endHeight: 45 + 'px' } }),
    transition('invisible => visible', animate('200ms ease-in', style({ height: '{{endHeight}}px' }))),
    transition('visible => invisible', animate('200ms ease-in', style({ height: '{{startHeight}}px' })))
  ])]
})
export class SelectDropdownComponent
  implements AfterViewInit, OnChanges, OnInit {

  @Input() filterEnabled: boolean;
  @Input() highlightColor: string;
  @Input() highlightTextColor: string;
  @Input() left: number;
  @Input() multiple: boolean;
  @Input() notFoundMsg: string;
  @Input() optionList: OptionList;
  @Input() top: number;
  @Input() width: number;
  @Input() placeholder: string;
  @Input() customClass = '';
  @Output() close = new EventEmitter<boolean>();
  @Output() optionClicked = new EventEmitter<Option>();
  @Output() singleFilterClick = new EventEmitter<null>();
  @Output() singleFilterInput = new EventEmitter<string>();
  @Output() singleFilterKeydown = new EventEmitter<any>();

  @ViewChild('filterInput') filterInput: any;
  @ViewChild('optionsList') optionsList: any;
  @ViewChild('dropdownContent') dropdownContent: ElementRef;
  disabledColor = '#fff';
  disabledTextColor = '9e9e9e';

  // Used in sliding-down animation
  state = 'invisible';
  startHeight: any = 0;
  endHeight: any = 45;

  public hasOptionsItems = true;

  constructor(private _elementRef: ElementRef, public _renderer: Renderer2, private cdRef: ChangeDetectorRef) { }

  /** Event handlers. **/

  // Angular life cycle hooks.

  @HostListener('keyup') onkeyup() {
    this.hasOptionsItems = this._elementRef.nativeElement.childNodes[0].children[1].children[0].children.length >= 1 ? true : false;
  }


  ngOnInit() {
    this.optionsReset();
  }

  ngOnChanges(changes: any) {
    if (changes.hasOwnProperty('optionList')) {
      this.optionsReset();
    }

    const container = this._elementRef.nativeElement.classList;
    setTimeout(() => { container.add('fadeInSelect'); }, 200);
  }

  ngAfterViewInit() {
    // Sliding-down animation
    this.endHeight = this.dropdownContent.nativeElement.clientHeight;
    this.state = (this.state === 'invisible' ? 'visible' : 'invisible');
    this.cdRef.detectChanges();

    // Dropping up dropdown content of Material Select when near bottom edge of the screen
    // Need fix to proper work with sliding animation

    // tslint:disable-next-line:max-line-length
    // if (window.innerHeight - this._elementRef.nativeElement.getBoundingClientRect().bottom < this.dropdownContent.nativeElement.clientHeight) {
    //   this._renderer.setStyle(this.dropdownContent.nativeElement, 'top', - this.dropdownContent.nativeElement.clientHeight + 'px');
    // }
    if (this.multiple) {
      this._elementRef.nativeElement.querySelectorAll('.disabled.optgroup').forEach((element: any) => {
        this._renderer.setStyle(element.firstElementChild.lastElementChild, 'display', 'none');
      });
    }
    try {
      if (!(this._elementRef.nativeElement.parentElement == undefined)) {
        setTimeout(() => {
          if (this._elementRef.nativeElement.parentElement.attributes.customClass !== undefined) {
            this.customClass = this._elementRef.nativeElement.parentElement.attributes.customClass.value;
          }
        }, 0);
      }
    } catch (error) {
    }

    this.moveHighlightedIntoView();
    if (this.filterEnabled) {
      this.filterInput.nativeElement.focus();
    }
  }
  // Filter input (single select).

  onSingleFilterClick() {
    this.singleFilterClick.emit(null);
  }

  onSingleFilterInput(event: any) {
    this.singleFilterInput.emit(event.target.value);
  }

  onSingleFilterKeydown(event: any) {
    this.singleFilterKeydown.emit(event);
  }

  // Options list.

  onOptionsWheel(event: any) {
    this.handleOptionsWheel(event);
  }

  onOptionMouseover(option: Option) {
    this.optionList.highlightOption(option);
  }

  onOptionClick(option: Option) {
    this.optionClicked.emit(option);
  }

  /** Initialization. **/

  private optionsReset() {
    this.optionList.filter('');
    this.optionList.highlight();
  }

  /** View. **/

  getOptionStyle(option: Option): any {
    if (option.highlighted) {
      const optionStyle: any = {};

      if (typeof this.highlightColor !== 'undefined') {
        optionStyle['background-color'] = this.highlightColor;
      }
      if (typeof this.highlightTextColor !== 'undefined') {
        optionStyle['color'] = this.highlightTextColor;
      }
      return optionStyle;
    } else {
      return {};
    }
  }

  clearFilterInput() {
    if (this.filterEnabled) {
      this.filterInput.nativeElement.value = '';
    }
  }

  moveHighlightedIntoView() {

    const list = this.optionsList.nativeElement;
    const listHeight = list.offsetHeight;

    const itemIndex = this.optionList.getHighlightedIndex();

    if (itemIndex > -1) {
      const item = list.children[0].children[itemIndex];
      const itemHeight = item.offsetHeight;

      const itemTop = itemIndex * itemHeight;
      const itemBottom = itemTop + itemHeight;

      const viewTop = list.scrollTop;
      const viewBottom = viewTop + listHeight;

      if (itemBottom > viewBottom) {
        list.scrollTop = itemBottom - listHeight;
      } else if (itemTop < viewTop) {
        list.scrollTop = itemTop;
      }

    }
  }

  private handleOptionsWheel(e: any) {
    const div = this.optionsList.nativeElement;
    const atTop = div.scrollTop === 0;
    const atBottom = div.offsetHeight + div.scrollTop === div.scrollHeight;

    if (atTop && e.deltaY < 0) {
      e.preventDefault();
    } else if (atBottom && e.deltaY > 0) {
      e.preventDefault();
    }

  }

}
