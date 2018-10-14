import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutividadeCallCenterComponent } from './produtividade-call-center.component';

describe('ProdutividadeCallCenterComponent', () => {
  let component: ProdutividadeCallCenterComponent;
  let fixture: ComponentFixture<ProdutividadeCallCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdutividadeCallCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutividadeCallCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
