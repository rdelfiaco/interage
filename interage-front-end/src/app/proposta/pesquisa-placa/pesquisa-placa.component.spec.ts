import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisaPlacaComponent } from './pesquisa-placa.component';

describe('PesquisaPlacaComponent', () => {
  let component: PesquisaPlacaComponent;
  let fixture: ComponentFixture<PesquisaPlacaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PesquisaPlacaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PesquisaPlacaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
