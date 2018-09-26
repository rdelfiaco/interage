import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemarketingComponent } from './telemarketing.component';

describe('TelemarketingComponent', () => {
  let component: TelemarketingComponent;
  let fixture: ComponentFixture<TelemarketingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelemarketingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelemarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
