import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassifcacaoDeClientesComponent } from './classifcacao-de-clientes.component';

describe('ClassifcacaoDeClientesComponent', () => {
  let component: ClassifcacaoDeClientesComponent;
  let fixture: ComponentFixture<ClassifcacaoDeClientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassifcacaoDeClientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassifcacaoDeClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
