import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcluirEventoComponent } from './concluir-evento.component';

describe('ConcluirEventoComponent', () => {
  let component: ConcluirEventoComponent;
  let fixture: ComponentFixture<ConcluirEventoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcluirEventoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcluirEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
