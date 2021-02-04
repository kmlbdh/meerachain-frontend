import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemsOrderComponent } from './create-items-order.component';

describe('CreateItemsOrderComponent', () => {
  let component: CreateItemsOrderComponent;
  let fixture: ComponentFixture<CreateItemsOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateItemsOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateItemsOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
