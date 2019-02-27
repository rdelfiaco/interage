import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAgenteComponent } from './dashboard-agente.component';

describe('DashboardAgenteComponent', () => {
  let component: DashboardAgenteComponent;
  let fixture: ComponentFixture<DashboardAgenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAgenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAgenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
