import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemPermissaoComponent } from './sem-permissao.component';

describe('SemPermissaoComponent', () => {
  let component: SemPermissaoComponent;
  let fixture: ComponentFixture<SemPermissaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemPermissaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemPermissaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
