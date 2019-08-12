import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDeClienteComponent } from './tipo-de-cliente.component';

describe('TipoDeClienteComponent', () => {
  let component: TipoDeClienteComponent;
  let fixture: ComponentFixture<TipoDeClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoDeClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoDeClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
