import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadCampanhaComponent } from './read-campanha.component';

describe('ReadCampanhaComponent', () => {
  let component: ReadCampanhaComponent;
  let fixture: ComponentFixture<ReadCampanhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadCampanhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadCampanhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
