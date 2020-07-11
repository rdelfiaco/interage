import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateReadComponent } from './email-template-read.component';

describe('EmailTemplateReadComponent', () => {
  let component: EmailTemplateReadComponent;
  let fixture: ComponentFixture<EmailTemplateReadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTemplateReadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
