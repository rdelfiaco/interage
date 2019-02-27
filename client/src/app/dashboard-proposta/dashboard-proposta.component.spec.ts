import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPropostaComponent } from './dashboard-proposta.component';

describe('DashboardPropostaComponent', () => {
  let component: DashboardPropostaComponent;
  let fixture: ComponentFixture<DashboardPropostaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPropostaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
