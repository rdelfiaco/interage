import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosInterageComponent } from './parametros-interage.component';

describe('ParametrosInterageComponent', () => {
  let component: ParametrosInterageComponent;
  let fixture: ComponentFixture<ParametrosInterageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrosInterageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosInterageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
