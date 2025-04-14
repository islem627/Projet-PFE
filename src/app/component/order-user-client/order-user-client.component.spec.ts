import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderUserClientComponent } from './order-user-client.component';

describe('OrderUserClientComponent', () => {
  let component: OrderUserClientComponent;
  let fixture: ComponentFixture<OrderUserClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderUserClientComponent]
    });
    fixture = TestBed.createComponent(OrderUserClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
