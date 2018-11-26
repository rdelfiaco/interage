import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisaClienteComponent } from './pesquisa-cliente.component';

describe('PesquisaClienteComponent', () => {
  let component: PesquisaClienteComponent;
  let fixture: ComponentFixture<PesquisaClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PesquisaClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PesquisaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
