import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCarteiraComponent } from './usuario-carteira.component';

describe('UsuarioCarteiraComponent', () => {
  let component: UsuarioCarteiraComponent;
  let fixture: ComponentFixture<UsuarioCarteiraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioCarteiraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioCarteiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
