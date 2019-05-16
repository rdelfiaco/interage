import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheDeCampanhaComponent } from './detalhe-de-campanha.component';

describe('DetalheDeCampanhaComponent', () => {
  let component: DetalheDeCampanhaComponent;
  let fixture: ComponentFixture<DetalheDeCampanhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalheDeCampanhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalheDeCampanhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
