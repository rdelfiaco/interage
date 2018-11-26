import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisaTabelaFipeComponent } from './pesquisa-tabela-fipe.component';

describe('PesquisaTabelaFipeComponent', () => {
  let component: PesquisaTabelaFipeComponent;
  let fixture: ComponentFixture<PesquisaTabelaFipeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PesquisaTabelaFipeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PesquisaTabelaFipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
