import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemLinhaDoTempoEventoComponent } from './item-linha-do-tempo-evento.component';

describe('ItemLinhaDoTempoEventoComponent', () => {
  let component: ItemLinhaDoTempoEventoComponent;
  let fixture: ComponentFixture<ItemLinhaDoTempoEventoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemLinhaDoTempoEventoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemLinhaDoTempoEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
