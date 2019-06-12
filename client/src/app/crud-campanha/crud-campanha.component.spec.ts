import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudCampanhaComponent } from './crud-campanha.component';

describe('CrudCampanhaComponent', () => {
  let component: CrudCampanhaComponent;
  let fixture: ComponentFixture<CrudCampanhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudCampanhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudCampanhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
