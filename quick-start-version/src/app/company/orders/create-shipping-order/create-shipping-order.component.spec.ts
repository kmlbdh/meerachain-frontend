import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShippingOrderComponent } from './create-shipping-order.component';

describe('CreateShippingOrderComponent', () => {
  let component: CreateShippingOrderComponent;
  let fixture: ComponentFixture<CreateShippingOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateShippingOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShippingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
