import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCampanhaComponent } from './update-campanha.component';

describe('UpdateCampanhaComponent', () => {
  let component: UpdateCampanhaComponent;
  let fixture: ComponentFixture<UpdateCampanhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCampanhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCampanhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
