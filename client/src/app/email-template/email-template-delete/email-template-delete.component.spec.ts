import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateDeleteComponent } from './email-template-delete.component';

describe('EmailTemplateDeleteComponent', () => {
  let component: EmailTemplateDeleteComponent;
  let fixture: ComponentFixture<EmailTemplateDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTemplateDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
