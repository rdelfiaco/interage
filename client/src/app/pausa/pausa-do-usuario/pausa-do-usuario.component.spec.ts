import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PausaDoUsuarioComponent } from './pausa-do-usuario.component';

describe('PausaDoUsuarioComponent', () => {
  let component: PausaDoUsuarioComponent;
  let fixture: ComponentFixture<PausaDoUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PausaDoUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PausaDoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
