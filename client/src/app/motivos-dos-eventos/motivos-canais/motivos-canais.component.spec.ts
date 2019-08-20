import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivosCanaisComponent } from './motivos-canais.component';

describe('MotivosCanaisComponent', () => {
  let component: MotivosCanaisComponent;
  let fixture: ComponentFixture<MotivosCanaisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivosCanaisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivosCanaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
