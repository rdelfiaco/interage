import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSupervisorComponent } from './dashboard-supervisor.component';

describe('DashboardSupervisorComponent', () => {
  let component: DashboardSupervisorComponent;
  let fixture: ComponentFixture<DashboardSupervisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSupervisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
