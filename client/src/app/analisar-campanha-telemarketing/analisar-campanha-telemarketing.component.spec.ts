import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisarCampanhaTelemarketingComponent } from './analisar-campanha-telemarketing.component';

describe('AnalisarCampanhaTelemarketingComponent', () => {
  let component: AnalisarCampanhaTelemarketingComponent;
  let fixture: ComponentFixture<AnalisarCampanhaTelemarketingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalisarCampanhaTelemarketingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisarCampanhaTelemarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
