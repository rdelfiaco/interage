import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheEventoComponent } from './detalhe-evento.component';

describe('DetalheEventoComponent', () => {
  let component: DetalheEventoComponent;
  let fixture: ComponentFixture<DetalheEventoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalheEventoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalheEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
