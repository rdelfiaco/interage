import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivosRespostasComponent } from './motivos-respostas.component';

describe('MotivosRespostasComponent', () => {
  let component: MotivosRespostasComponent;
  let fixture: ComponentFixture<MotivosRespostasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivosRespostasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivosRespostasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
