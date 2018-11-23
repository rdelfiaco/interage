import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviaPropostaComponent } from './envia-proposta.component';

describe('EnviaPropostaComponent', () => {
  let component: EnviaPropostaComponent;
  let fixture: ComponentFixture<EnviaPropostaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnviaPropostaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviaPropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
