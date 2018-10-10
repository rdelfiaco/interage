import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDeEventoComponent } from './item-de-evento.component';

describe('ItemDeEventoComponent', () => {
  let component: ItemDeEventoComponent;
  let fixture: ComponentFixture<ItemDeEventoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDeEventoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDeEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
