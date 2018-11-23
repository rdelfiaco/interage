import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LerTabelaFipeComponent } from './ler-tabela-fipe.component';

describe('LerTabelaFipeComponent', () => {
  let component: LerTabelaFipeComponent;
  let fixture: ComponentFixture<LerTabelaFipeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LerTabelaFipeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LerTabelaFipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
