import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgoritmosComponent } from './algoritmos.component';

describe('AlgoritmosComponent', () => {
  let component: AlgoritmosComponent;
  let fixture: ComponentFixture<AlgoritmosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlgoritmosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgoritmosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
