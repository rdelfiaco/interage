import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEventoComponent } from './formulario-evento.component';

describe('FormularioEventoComponent', () => {
  let component: FormularioEventoComponent;
  let fixture: ComponentFixture<FormularioEventoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioEventoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
