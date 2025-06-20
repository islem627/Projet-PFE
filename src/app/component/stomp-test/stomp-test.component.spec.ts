import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StompTestComponent } from './stomp-test.component';

describe('StompTestComponent', () => {
  let component: StompTestComponent;
  let fixture: ComponentFixture<StompTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StompTestComponent]
    });
    fixture = TestBed.createComponent(StompTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
