import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivosDosEventosComponent } from './motivos-dos-eventos.component';

describe('MotivosDosEventosComponent', () => {
  let component: MotivosDosEventosComponent;
  let fixture: ComponentFixture<MotivosDosEventosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivosDosEventosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivosDosEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
