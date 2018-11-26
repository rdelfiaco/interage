import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncaminharEventoComponent } from './encaminhar-evento.component';

describe('EncaminharEventoComponent', () => {
  let component: EncaminharEventoComponent;
  let fixture: ComponentFixture<EncaminharEventoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncaminharEventoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncaminharEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
