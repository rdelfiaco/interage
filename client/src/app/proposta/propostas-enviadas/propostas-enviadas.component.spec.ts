import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropostasEnviadasComponent } from './propostas-enviadas.component';

describe('PropostasEnviadasComponent', () => {
  let component: PropostasEnviadasComponent;
  let fixture: ComponentFixture<PropostasEnviadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropostasEnviadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropostasEnviadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
