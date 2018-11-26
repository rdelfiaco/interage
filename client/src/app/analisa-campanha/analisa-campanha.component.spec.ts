import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisaCampanhaComponent } from './analisa-campanha.component';

describe('AnalisaCampanhaComponent', () => {
  let component: AnalisaCampanhaComponent;
  let fixture: ComponentFixture<AnalisaCampanhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalisaCampanhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisaCampanhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
