import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaisorderComponent } from './detaisorder.component';

describe('DetaisorderComponent', () => {
  let component: DetaisorderComponent;
  let fixture: ComponentFixture<DetaisorderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetaisorderComponent]
    });
    fixture = TestBed.createComponent(DetaisorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
