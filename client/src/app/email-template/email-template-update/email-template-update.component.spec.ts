import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateUpdateComponent } from './email-template-update.component';

describe('EmailTemplateUpdateComponent', () => {
  let component: EmailTemplateUpdateComponent;
  let fixture: ComponentFixture<EmailTemplateUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTemplateUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
