import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RespostaEditComponent } from './resposta-edit.component';

describe('RespostaEditComponent', () => {
  let component: RespostaEditComponent;
  let fixture: ComponentFixture<RespostaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RespostaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RespostaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
