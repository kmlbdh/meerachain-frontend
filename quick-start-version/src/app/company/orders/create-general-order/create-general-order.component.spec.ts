import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGeneralOrderComponent } from './create-general-order.component';

describe('CreateGeneralOrderComponent', () => {
  let component: CreateGeneralOrderComponent;
  let fixture: ComponentFixture<CreateGeneralOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGeneralOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGeneralOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
