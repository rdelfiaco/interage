import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivosEventosAutomaticosComponent } from './motivos-eventos-automaticos.component';

describe('MotivosEventosAutomaticosComponent', () => {
  let component: MotivosEventosAutomaticosComponent;
  let fixture: ComponentFixture<MotivosEventosAutomaticosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivosEventosAutomaticosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivosEventosAutomaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
