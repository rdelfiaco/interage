import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjecaoComponent } from './objecao.component';

describe('ObjecaoComponent', () => {
  let component: ObjecaoComponent;
  let fixture: ComponentFixture<ObjecaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjecaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
