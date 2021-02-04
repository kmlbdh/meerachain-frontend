import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomsOrderComponent } from './create-customs-order.component';

describe('CreateCustomsOrderComponent', () => {
  let component: CreateCustomsOrderComponent;
  let fixture: ComponentFixture<CreateCustomsOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCustomsOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCustomsOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
