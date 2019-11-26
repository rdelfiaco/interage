import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDeRelacionamentoComponent } from './tipo-de-relacionamento.component';

describe('TipoDeRelacionamentoComponent', () => {
  let component: TipoDeRelacionamentoComponent;
  let fixture: ComponentFixture<TipoDeRelacionamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoDeRelacionamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoDeRelacionamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
