import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChattComponent } from './chatt.component';

describe('ChattComponent', () => {
  let component: ChattComponent;
  let fixture: ComponentFixture<ChattComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChattComponent]
    });
    fixture = TestBed.createComponent(ChattComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
