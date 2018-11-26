import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinhaDoTempoEventoComponent } from './linha-do-tempo-evento.component';

describe('LinhaDoTempoEventoComponent', () => {
  let component: LinhaDoTempoEventoComponent;
  let fixture: ComponentFixture<LinhaDoTempoEventoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinhaDoTempoEventoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinhaDoTempoEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
