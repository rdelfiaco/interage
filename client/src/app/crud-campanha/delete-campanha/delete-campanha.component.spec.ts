import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCampanhaComponent } from './delete-campanha.component';

describe('DeleteCampanhaComponent', () => {
  let component: DeleteCampanhaComponent;
  let fixture: ComponentFixture<DeleteCampanhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCampanhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCampanhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
