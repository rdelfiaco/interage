import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerguntaAddComponent } from './pergunta-add.component';

describe('PerguntaAddComponent', () => {
  let component: PerguntaAddComponent;
  let fixture: ComponentFixture<PerguntaAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerguntaAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerguntaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
