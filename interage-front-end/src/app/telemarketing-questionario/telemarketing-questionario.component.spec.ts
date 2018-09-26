import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemarketingQuestionarioComponent } from './telemarketing-questionario.component';

describe('TelemarketingQuestionarioComponent', () => {
  let component: TelemarketingQuestionarioComponent;
  let fixture: ComponentFixture<TelemarketingQuestionarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelemarketingQuestionarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelemarketingQuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
