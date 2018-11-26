import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOperadorComponent } from './dashboard-operador.component';

describe('DashboardOperadorComponent', () => {
  let component: DashboardOperadorComponent;
  let fixture: ComponentFixture<DashboardOperadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardOperadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
