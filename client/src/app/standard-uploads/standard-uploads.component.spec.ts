import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardUploadsComponent } from './standard-uploads.component';

describe('StandardUploadsComponent', () => {
  let component: StandardUploadsComponent;
  let fixture: ComponentFixture<StandardUploadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardUploadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
