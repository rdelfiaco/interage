import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionarioEditComponent } from './questionario-edit.component';

describe('QuestionarioEditComponent', () => {
  let component: QuestionarioEditComponent;
  let fixture: ComponentFixture<QuestionarioEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionarioEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionarioEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
