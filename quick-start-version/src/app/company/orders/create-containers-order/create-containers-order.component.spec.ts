import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContainersOrderComponent } from './create-containers-order.component';

describe('CreateContainersOrderComponent', () => {
  let component: CreateContainersOrderComponent;
  let fixture: ComponentFixture<CreateContainersOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateContainersOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContainersOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
