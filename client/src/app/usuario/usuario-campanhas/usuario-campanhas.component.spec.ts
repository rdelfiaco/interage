import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCampanhasComponent } from './usuario-campanhas.component';

describe('UsuarioCampanhasComponent', () => {
  let component: UsuarioCampanhasComponent;
  let fixture: ComponentFixture<UsuarioCampanhasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioCampanhasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioCampanhasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
