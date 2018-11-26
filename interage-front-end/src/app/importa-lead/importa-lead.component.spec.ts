import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportaLeadComponent } from './importa-lead.component';

describe('ImportaLeadComponent', () => {
  let component: ImportaLeadComponent;
  let fixture: ComponentFixture<ImportaLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportaLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportaLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
