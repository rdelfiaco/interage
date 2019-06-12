import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCampanhaComponent } from './create-campanha.component';

describe('CreateCampanhaComponent', () => {
  let component: CreateCampanhaComponent;
  let fixture: ComponentFixture<CreateCampanhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCampanhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCampanhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
