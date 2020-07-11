import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateCreateComponent } from './email-template-create.component';

describe('EmailTemplateCreateComponent', () => {
  let component: EmailTemplateCreateComponent;
  let fixture: ComponentFixture<EmailTemplateCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTemplateCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
