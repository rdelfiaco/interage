import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RespostaAddComponent } from './resposta-add.component';

describe('RespostaAddComponent', () => {
  let component: RespostaAddComponent;
  let fixture: ComponentFixture<RespostaAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RespostaAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RespostaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
