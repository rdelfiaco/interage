import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelacionamentoVoltaComponent } from './relacionamento-volta.component';

describe('RelacionamentoVoltaComponent', () => {
  let component: RelacionamentoVoltaComponent;
  let fixture: ComponentFixture<RelacionamentoVoltaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelacionamentoVoltaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelacionamentoVoltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
