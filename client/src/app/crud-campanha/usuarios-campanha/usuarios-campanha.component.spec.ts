import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosCampanhaComponent } from './usuarios-campanha.component';

describe('UsuariosCampanhaComponent', () => {
  let component: UsuariosCampanhaComponent;
  let fixture: ComponentFixture<UsuariosCampanhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuariosCampanhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosCampanhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
